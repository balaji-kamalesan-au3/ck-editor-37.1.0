import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

const addSuggestion = {
    name: 'addSuggestion',
    event  : 'Suggestion Added'
}

const discardSuggestion = {
    name: 'discardSuggestion',
    event  : 'Suggestion Discarded'
}

const acceptSuggestion = {
    name: 'acceptSuggestion',
    event  : 'Suggestion Accepted'
}


export default class SuggestionEventsHandler extends Plugin{
    init(){
        const editor = this.editor
        this.handleSuggestions(editor);
    }

    handleSuggestions (editor) {
        this.suggestionAdded(editor);
        this.suggestionDiscarded(editor);
        this.suggestionAccepted(editor);
    }  

    suggestionAdded (editor) {
        const trackChangesPlugin = editor.plugins.get('TrackChangesEditing');
        trackChangesPlugin.on('suggestionLoaded', (evt, data) => {
            if(editor.config._config.mixPanel){
                editor.config._config.mixPanel(addSuggestion.event,{role :editor.config._config.role || 'author'})
            }
        });
    }

    suggestionDiscarded (editor) {
        const discardSuggestionCommand = editor.commands.get('discardSuggestion');
        discardSuggestionCommand.on('execute', (evt, data) => {
            if(editor.config._config.mixPanel){
                editor.config._config.mixPanel(discardSuggestion.event,{role :editor.config._config.role || 'author'})
            }
        });
    }

    suggestionAccepted (editor) {
        const acceptSuggestionCommand = editor.commands.get('acceptSuggestion');
        acceptSuggestionCommand.on('execute', (evt, data) => {
            if(editor.config._config.mixPanel){
                editor.config._config.mixPanel(acceptSuggestion.event,{role :editor.config._config.role || 'author'})
            }
        });
    }
}