import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import {
	needsPlaceholder,
	showPlaceholder,
	hidePlaceholder,
	enablePlaceholder,
} from 'ckeditor5/src/engine';
import RemoveUnwantedPlaceholder from './RemovePlaceHolderCommand';
import isImageBlock from '../Utils/CheckElement';


export default class EditorSchema extends Plugin {
	init() {
		const editor = this.editor;
		const model = this.editor.model
		model.schema.register( 'title', { isBlock: true, allowIn: '$root' } );
		model.schema.register( 'title-content', { isBlock: true,isLimit:true, allowIn: '$root',  } );
	
		model.schema.extend( '$text', { allowIn: 'title-content' } );
		model.schema.register( 'summary-content', { isBlock: true,isLimit : true,allowIn: '$root' } );
		model.schema.extend( '$text', { allowIn: 'summary-content' } );
		model.schema.register( 'summary-by-line', { isBlock: true, isLimit : true,allowIn: '$root' } );
		model.schema.extend( '$text', { allowIn: 'summary-by-line' } );

	
		model.schema.register('finalPlaceHolder',{isBlock: true,allowIn:'$root'});
		editor.conversion.for( 'downcast' ).elementToElement( { model: 'title-content', view: 'h1' } );
		editor.conversion.for( 'downcast' ).elementToElement( { model: 'summary-content', view: 'h3' } );
		editor.conversion.for( 'downcast' ).elementToElement( { model: 'summary-by-line', view: 'h4' } );
		editor.conversion.for( 'downcast' ).elementToElement( { model: 'finalPlaceHolder', view: 'h6' } );

		editor.conversion.for( 'upcast' ).elementToElement({view: 'h1',model: 'title-content'});
		editor.conversion.for( 'upcast' ).elementToElement({view:'h3',model: 'summary-content'});
		editor.conversion.for( 'upcast' ).elementToElement({view: 'h4',model: 'summary-by-line'});
		editor.conversion.for( 'upcast' ).elementToElement({view:'h6',model:'finalPlaceHolder'});

		const getShouldCreateSchema = (schemaData) => ['<h1>', '<h3>', '<h4>'].some(el => schemaData.includes(el));

		model.document.registerPostFixer(writer => {
			const root = model.document.getRoot();

			const shouldCreateSchema = getShouldCreateSchema(editor.getData())
			if(root.childCount === 1 && !shouldCreateSchema ){
				writer.insertElement('title-content',root, 0);
				writer.insertElement('summary-content',root, 1);
				writer.insertElement('summary-by-line',root, 2);
				const coverImage = writer.createElement('imageBlock',{"src":editor.config._config.coverImage});
				writer.insert(coverImage,root, 3);
				return true
			}
			return false;
		})

		model.document.registerPostFixer(writer => {
			const root = model.document.getRoot();
			const imageBlock  = root.getChild(3);
			if(imageBlock && imageBlock.name !== 'imageBlock'){
				const coverImage = writer.createElement('imageBlock',{"src":editor.config._config.coverImage});
				writer.insert(coverImage,root, 3);
				return true
			}
			return false;
		})

		model.document.registerPostFixer(writer => {
			const root = model.document.getRoot();
			const storyTitle = root.getChild(0);
			const summary = root.getChild(1);
			const summaryByLine = root.getChild(2);
			const imageBlock = root.getChild(3)
			let isUndo = false;
			if(!storyTitle || storyTitle.name !== 'title-content'){
				isUndo = true
			}
			if(!summary || summary.name !== 'summary-content'){
				isUndo = true
			}
			if(!summaryByLine || summaryByLine.name !== 'summary-by-line'){
				isUndo = true
			}
			if(!imageBlock || imageBlock.name !== 'imageBlock'){
				isUndo = true
			}
			if(isUndo){
				this.editor.execute('undo')
			}
		})

		// Fix Title Element
		model.document.registerPostFixer(writer => this._fixTitleElement(writer))
		model.document.registerPostFixer(writer => this._fixSummaryElement(writer))
		model.document.registerPostFixer(writer => this._fixSummaryByLineElement(writer))
		model.document.registerPostFixer(writer => this._fixImageBlockElement(writer))
		model.document.registerPostFixer(writer => this._handleFinalImageBlock())

		this._attachPlaceholders();
		this._checkAttributes(model);
		this.editor.commands.add('removePlaceholder', new RemoveUnwantedPlaceholder(this.editor));

	}

	_checkAttributes(model){
		model.schema.addAttributeCheck((context,attributeName) => {
			if ( context.endsWith( 'title-content $text' ) && (attributeName == 'bold' || attributeName == 'italic'|| attributeName == 'underline' || attributeName === 'linkHref') ) {
				return false;
			}
			if ( context.endsWith( 'summary-content $text' ) && (attributeName == 'bold' || attributeName == 'italic'|| attributeName == 'underline' || attributeName === 'linkHref') ) {
				return false;
			}
			if ( context.endsWith( 'summary-by-line $text' ) && (attributeName == 'bold' || attributeName == 'italic'|| attributeName == 'underline' || attributeName === 'linkHref') ) {
				return false;
			}
		})
	}

	_attachPlaceholders() {
		const editor = this.editor;
		const t = editor.t;
		const view = editor.editing.view;
		const viewRoot = view.document.getRoot();
		const sourceElement = editor.sourceElement;
		const root= editor.model.document.getRoot();
		const titlePlaceholder = editor.config.get( 'title.placeholder' ) || t( 'Type your title' );
		
		// Attach placeholder to the view title element.
		editor.editing.downcastDispatcher.on( 'insert:title-content', ( evt, data, conversionApi ) => {
			enablePlaceholder( {
				view,
				element: conversionApi.mapper.toViewElement( data.item ),
				text: titlePlaceholder,
				keepOnFocus: true
			} );
		} );
		editor.editing.downcastDispatcher.on( 'insert:summary-content', ( evt, data, conversionApi ) => {
			enablePlaceholder( {
				view,
				element: conversionApi.mapper.toViewElement( data.item ),
				text: "Summary",
				keepOnFocus: true
			} );
		} );
		editor.editing.downcastDispatcher.on( 'insert:summary-by-line', ( evt, data, conversionApi ) => {
			enablePlaceholder( {
				view,
				element: conversionApi.mapper.toViewElement( data.item ),
				text: "Summary By Line",
				keepOnFocus: true
			} );
		} );

		let oldBody;


		view.document.registerPostFixer(writer => {
			const count = viewRoot.childCount;
			const hasChanged = false;
			const currentElement = viewRoot.getChild(4);
			const bodyPlaceHolderText = "Type your story here, Double click to open Toolbar"
			if(currentElement && currentElement.name === 'p'){
				writer.setAttribute( 'data-placeholder', bodyPlaceHolderText, currentElement );
				showPlaceholder(writer,currentElement)
				if(!needsPlaceholder(currentElement,true) || count > 5){
					hidePlaceholder( writer, currentElement );
					writer.removeAttribute( 'data-placeholder', currentElement);
				}
			}
		
			return hasChanged
		})


		view.document.registerPostFixer(writer => {
			const hasChanged = false;
			const mainContent = viewRoot.getChild(4);
			for(const child of viewRoot.getChildren()){
				if(mainContent !== child && child.name === 'p'){
					if(child.hasAttribute('data-placeholder')){
						hidePlaceholder( writer, child );
						writer.removeAttribute( 'data-placeholder', child);
					}
					
				}
			}
			return hasChanged
		})

	}

	_fixTitleElement(writer){
		const model = this.editor.model;
		const modelRoot = model.document.getRoot();
		const titleElements = Array.from( modelRoot.getChildren()).filter( isTitle );
		if(titleElements.length > 0){
			for(let i=1;i<titleElements.length;i++){
				writer.remove(titleElements[i]);
			}
		}

	}
	_fixSummaryElement(writer){
		const model = this.editor.model;
		const modelRoot = model.document.getRoot();
		const summaryElements = Array.from( modelRoot.getChildren()).filter( isSummary );
		if(summaryElements && summaryElements.length > 0){
			for(let i=1;i<summaryElements.length;i++){
				writer.remove(summaryElements[i]);
			}
		}
	}
	_fixSummaryByLineElement(writer){
		const model = this.editor.model;
		const modelRoot = model.document.getRoot();
		const summaryBylineElements = Array.from( modelRoot.getChildren()).filter( isSummaryByLine );
		if(summaryBylineElements.length > 0){
			for(let i=1;i<summaryBylineElements.length;i++){
				writer.remove(summaryBylineElements[i]);
			}
		}

	}
	_fixImageBlockElement(writer){
		const model = this.editor.model;
		const modelRoot = model.document.getRoot();
		const imageBlockElements = Array.from( modelRoot.getChildren()).filter( isImageBlock );
		if(imageBlockElements.length > 0){
			for(let i=1;i<imageBlockElements.length;i++){
				const attr = imageBlockElements[i]._attrs;
				const src =attr.get('src')
				if(src === 'https://cdn.thisday.app/icons/upload.jpg'){
					writer.remove(imageBlockElements[i])
				}
			}
		}
	}
	_getTitleElement() {
		const root = this.editor.model.document.getRoot();

		for ( const child of root.getChildren() ) {
			if ( isTitle( child ) ) {
				return child;
			}
		}
	}

	// Add Paragraph to image if there is no paragraph after image, if the image is the last element in the editor
	_handleFinalImageBlock(){
		const model = this.editor.model;
		const modelRoot = model.document.getRoot();
		const childrens = Array.from( modelRoot.getChildren())
		if(childrens.length > 2){
			const lastChild = childrens[childrens.length -1];
			if(isLastChildImage(lastChild)){
				model.change( writer => {
					const paragraph = writer.createElement( 'paragraph' );
					writer.insert( paragraph, modelRoot, 'end' );
				} );
			}		
		}
	}
}

function isTitle( element ) {
	return element.is( 'element', 'title-content' );
}

function isSummary( element ) {
	return element.is( 'element', 'summary-content' );
}

function isSummaryByLine( element ) {
	return element.is( 'element', 'summary-by-line' );
}

function isLastChildImage(lastChild){
	return lastChild.is( 'element', 'imageBlock' );
}

