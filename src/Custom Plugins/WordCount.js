import { modelElementToPlainText } from '@ckeditor/ckeditor5-word-count/src/utils';
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount.js';
import { View, Template } from 'ckeditor5/src/ui';

export default class NewWordCount extends WordCount{
	constructor(editor){
		super( editor );
		this.set('titleWordCount',0);
		this.set('titleCharacterCount',0)
		this.set('summaryWordCount',0)
		this.set('summaryCharacterCount',0)
		this.set('summaryByLineWordCount',0)
		this.set('summaryByLineCharacterCount',0)
		this.set('_titleWordsLabel')
		this.set('_titleCharactersLabel')
		this.set('_summaryWordsLabel')
		this.set('_summaryCharactersLabel')
		this.set('_summaryByLineWordsLabel')
		this.set('_summaryByLineCharactersLabel')

		Object.defineProperties( this, {
			characters: {
				get() {
					return ( this.characters = this._getCharacters() );
				}
			},
			words: {
				get() {
					return ( this.words = this._getWords() );
				}
			},
			titleWordCount: {
				get() {
					return ( this.titleWordCount = this._getTitleWords() );
				}
			},
			titleCharacterCount: {
				get() {
					return ( this.titleCharacterCount = this._getTitleCharacters() );
				}
			},
			summaryWordCount: {
				get() {
					return ( this.summaryWordCount = this._getSummaryWords() );
				}
			},
			summaryCharacterCount: {
				get() {
					return ( this.summaryCharacterCount = this._getSummaryCharacters() );
				}
			},
			summaryByLineWordCount: {
				get() {
					return ( this.summaryByLineWordCount = this._getSummaryBiLineWords() );
				}
			},
			summaryByLineCharacterCount: {
				get() {
					return ( this.summaryByLineCharacterCount = this._getSummaryByLineCharacters() );
				}
			}
		} );

	}

	get wordCountContainer() {
		const editor = this.editor;
		const t = editor.t;
		const displayWords = editor.config.get( 'wordCount.displayWords' );
		const displayCharacters = editor.config.get( 'wordCount.displayCharacters' );
		const displayTitleWords = editor.config.get( 'wordCount.displayTitleWords' );
		const displayTitleCharacters = editor.config.get( 'wordCount.displayTitleCharacters' );
		const displaySummaryWords = editor.config.get( 'wordCount.displaySummaryWords' );
		const displaySummaryCharacters = editor.config.get( 'wordCount.displaySummaryCharacters' );
		const displaySummaryByLineWords = editor.config.get( 'wordCount.displaySummaryByLineWords' );
		const displaySummaryByLineCharacters = editor.config.get( 'wordCount.displaySummaryByLineCharacters' );
		const bind = Template.bind( this, this );
		const children = [];

		if ( !this._outputView ) {
			this._outputView = new View();

			if ( displayWords || displayWords === undefined ) {
				this.bind( '_wordsLabel' ).to( this, 'words', words => {
					const newWordsCount = words - (this.titleWordCount + this.summaryWordCount + this.summaryByLineWordCount);
					if(words>0){
						return t( '%0', newWordsCount );
					}
				} );

				children.push( {
					tag: 'div',
					children: [
						{
							text: [ bind.to( '_wordsLabel' ) ]
						}
					],
					attributes: {
						class: 'ck-word-count__words wordCountContainer'
					}
				} );
			}
			if ( displayCharacters || displayCharacters === undefined ) {
				this.bind( '_charactersLabel' ).to( this, 'characters', words => {
					const newCharactersCount = this.characters - (this.titleCharacterCount + this.summaryCharacterCount + this.summaryByLineCharacterCount);
					return t( 'Characters: %0', newCharactersCount );
				} );

				children.push( {
					tag: 'div',
					children: [
						{
							text: [ bind.to( '_charactersLabel' ) ]
						}
					],
					attributes: {
						class: 'ck-word-count__characters'
					}
				} );
			}
			if ( displayTitleWords || displayTitleWords === undefined ) {
				this.bind( '_titleWordsLabel' ).to( this, 'titleWordCount', words => {
					return t( 'Title Words: %0', this.titleWordCount );
				} );

				children.push( {
					tag: 'div',
					children: [
						{
							text: [ bind.to( '_titleWordsLabel' ) ]
						}
					],
					attributes: {
						class: 'ck-word-count__words Title Words TitleWordsContainer'
					}
				} );
			}
			if ( displaySummaryWords || displaySummaryWords === undefined ) {
				this.bind( '_summaryWordsLabel' ).to( this, 'summaryWordCount', words => {
					return t( 'Summary Words: %0', this.summaryWordCount );
				} );

				children.push( {
					tag: 'div',
					children: [
						{
							text: [ bind.to( '_summaryWordsLabel' ) ]
						}
					],
					attributes: {
						class: 'ck-word-count__words SummaryWords SummaryWordsContainer'
					}
				} );
			}
			if ( displaySummaryByLineWords || displaySummaryByLineWords === undefined ) {
				this.bind( '_summaryByLineWordsLabel' ).to( this, 'summaryByLineWordCount', words => {
					return t( 'Summary By Line Words: %0', this.summaryByLineWordCount );
				} );

				children.push( {
					tag: 'div',
					children: [
						{
							text: [ bind.to( '_summaryByLineWordsLabel' ) ]
						}
					],
					attributes: {
						class: 'ck-word-count__words SummaryWords SummaryByLineWordsContainer'
					}
				} );
			}
			if ( displayTitleCharacters || displayTitleCharacters === undefined ) {
				this.bind( '_titleCharactersLabel' ).to( this, 'titleCharacterCount', words => {
					if(this.titleCharacterCount<=0){
						return t('SUGGESTED: 60 CHARACTERS');
					}
					return t( '%0', this.titleCharacterCount );
				} );

				children.push( {
					tag: 'div',
					children: [
						{
							text: [ bind.to( '_titleCharactersLabel' ) ]
						}
					],
					attributes: {
						class: 'ck-word-count__words TitleCharacters titleCharacterCount'
					}
				} );
			}	
			if ( displaySummaryCharacters || displaySummaryCharacters === undefined ) {
				this.bind( '_summaryCharactersLabel' ).to( this, 'summaryCharacterCount', words => {
					if(this.summaryCharacterCount<=0){
						return t('SUGGESTED: 300 CHARACTERS')
					}
					return t( '%0', this.summaryCharacterCount );
				} );

				children.push( {
					tag: 'div',
					children: [
						{
							text: [ bind.to( '_summaryCharactersLabel' ) ]
						}
					],
					attributes: {
						class: 'ck-word-count__words TitleCharacters summaryCharacterCount'
					}
				} );
			}	
			if ( displaySummaryByLineCharacters || displaySummaryByLineCharacters === undefined ) {
				this.bind( '_summaryByLineCharactersLabel' ).to( this, 'summaryByLineCharacterCount', words => {
					if(this.summaryByLineCharacterCount<=0){
						return t('MAX: 35 CHARACTERS')
					}
					return t( '%0', this.summaryByLineCharacterCount );
				} );

				children.push( {
					tag: 'div',
					children: [
						{
							text: [ bind.to( '_summaryByLineCharactersLabel' ) ]
						}
					],
					attributes: {
						class: 'ck-word-count__words TitleCharacters summaryByLineCharacterCount'
					}
				} );
			}	
			
			this._outputView.setTemplate( {
				tag: 'div',
				attributes: {
					class: [
						'ck',
						'ck-word-count'
					]
				},
				children
			} );

			this._outputView.render();
		}

		return this._outputView.element;
	}

	_getTitleCharacters() {
		const characterContainer = this.editor.model.document.getRoot().getChild(0);
		if(characterContainer){
			const txt = modelElementToPlainText(characterContainer  );
			return txt.replace( /\n/g, '' ).length;
		}
		else {
			return 0;
		}
		
	}
	_getSummaryCharacters() {
		const characterContainer = this.editor.model.document.getRoot().getChild(1);
		if(characterContainer){
			const txt = modelElementToPlainText(characterContainer  );
			return txt.replace( /\n/g, '' ).length;
		}
		else {
			return 0;
		}
		
	}
	_getTitleWords() {
		const titleContainer = this.editor.model.document.getRoot().getChild(0);
		if(titleContainer){
			const txt = modelElementToPlainText( titleContainer );
			const detectedWords = txt.match( this._wordsMatchRegExp ) || [];
			return detectedWords.length;
		}
		else {
			return 0;
		}
	}
	_getSummaryWords() {
		const titleContainer = this.editor.model.document.getRoot().getChild(1);
		if(titleContainer){
			const txt = modelElementToPlainText( titleContainer );
			const detectedWords = txt.match( this._wordsMatchRegExp ) || [];
			return detectedWords.length;
		}
		else {
			return 0;
		}
	}
	_getSummaryBiLineWords() {
		const titleContainer = this.editor.model.document.getRoot().getChild(2);
		if(titleContainer){
			const txt = modelElementToPlainText( titleContainer );
			const detectedWords = txt.match( this._wordsMatchRegExp ) || [];
			return detectedWords.length;
		}
		else {
			return 0;
		}
	}
	_getSummaryByLineCharacters() {
		const container = this.editor.model.document.getRoot().getChild(2);
		if(container){
			const txt = modelElementToPlainText(container  );
			return txt.replace( /\n/g, '' ).length;
		}
		else {
			return 0;
		}
	}

	_refreshStats() {
		const words = this.words = this._getWords();
		const characters = this.characters = this._getCharacters();
		const titleWordCount = this.titleWordCount = this._getTitleWords();
		const titleCharacterCount = this.titleCharacterCount = this._getTitleCharacters();
		const summaryWordCount = this.summaryWordCount = this._getSummaryWords();
		const summaryCharacterCount = this.summaryCharacterCount = this._getSummaryCharacters();
		const summaryByLineWordCount = this.summaryByLineWordCount = this._getSummaryBiLineWords();
		const summaryByLineCharacterCount = this.summaryByLineCharacterCount = this._getSummaryByLineCharacters();
		this.fire( 'update', {
			words,
			characters,
			titleWordCount,
			titleCharacterCount,
			summaryWordCount,
			summaryCharacterCount,
			summaryByLineWordCount,
			summaryByLineCharacterCount
		} );
	}
}
