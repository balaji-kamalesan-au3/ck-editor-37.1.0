import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class ChangeHandler extends Plugin{
    init(){
        const editor = this.editor
        this.handleTitleChange(editor);
        this.handelNewCommentAddChange(editor);
        
        
    }

    handleTitleChange(editor){
        editor.model.document.on('change:data',() => {
            const diff = editor.model.document.differ.getChanges();
            const isTitleChanged = diff.some(change => {
                const path  = change.position?.path;
                if(path?.length > 1 && path[0] === 0 ){
                    return true
                }
            })
            if(isTitleChanged && editor.config._config?.role === 'author'){
                editor.config._config.callSaveDraft();
            }     
        })
    }

    handelNewCommentAddChange(editor){
        const command = editor.commands.get('addCommentThread');
        this.listenTo(command,'execute',() => {
            // editor.config._config.switchSideBar();
            console.log('Hello Wprld')
        })
    }
}