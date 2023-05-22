import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { GetImageElements } from '../Utils/GetImageElements';
export default class ImageCaptionMandate extends Plugin{
    
    init(){
        const editor = this.editor
        const model = editor.model
        model.document.on('change:data',() => {
            const modelRoot = model.document.getRoot();
            const imageCaptionUtils = editor.plugins.get( 'ImageCaptionUtils' )
            const imageBlockElements = GetImageElements(modelRoot)
            let captionElement;
            if(imageBlockElements.length > 0){
                for(let i=0;i<imageBlockElements.length;i++){
                    captionElement = imageCaptionUtils.getCaptionFromImageModelElement( imageBlockElements[i] );
                    if(imageBlockElements[i].childCount === 2){
                        editor.execute('undo')
                    }
                    const src = imageBlockElements[i]._attrs.get('src');
                    if(!captionElement && src !== 'https://cdn.thisday.app/icons/upload.jpg'){               
                        editor.execute( 'toggleImageCaption' );
                    }
                }
            }
        })
    }

    _isCaptionsAddedForAllImages(){
        const editor = this.editor
        const model = editor.model
        const modelRoot = model.document.getRoot();
        const imageCaptionUtils = editor.plugins.get( 'ImageCaptionUtils' )
        const imageBlockElements = GetImageElements(modelRoot)
        let captionElement;
        if(imageBlockElements.length > 0){
            for(let i=0;i<imageBlockElements.length;i++){
                captionElement = imageCaptionUtils.getCaptionFromImageModelElement( imageBlockElements[i] );
                if(captionElement){
                    if(!captionElement._children._nodes.length){
                        return false
                    }
                }
                else return false
            }
        }
        return true
    }
}

