import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

const addComment = {
    name: 'addComment',
    event  : 'Comment Added'
}

const removeComment = {
    name: 'removeComment',
    event  : 'Comment Removed'
}

const updateComment = {
    name: 'updateComment',
    event  : 'Comment Updated'
}

const commentEvents = [addComment, removeComment, updateComment]

export default class CommentEventsHandler extends Plugin{
    init(){
        const editor = this.editor
        this.handleComments(editor);
    }

    handleComments (editor) {

        const commentsRepository = editor.plugins.get( 'CommentsRepository' );
        commentEvents.forEach((commentEvent) => {
            commentsRepository.on( commentEvent.name, (evt, data) => {
                console.log(data);
                if(editor.config._config.mixPanel){
                    editor.config._config.mixPanel(commentEvent.event)
                }
            } );
        })

    }

}