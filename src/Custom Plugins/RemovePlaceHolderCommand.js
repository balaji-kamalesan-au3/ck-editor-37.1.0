import Command from '@ckeditor/ckeditor5-core/src/command';

export default class RemoveUnwantedPlaceholder extends Command{
    execute(){
        const view = this.editor.editing.view;
        const viewRoot =   view.document.getRoot();
        for(const child of viewRoot.getChildren()){
            if(child.name === 'p'){
                if(child.hasAttribute('data-placeholder')){
                    view.change(writer => {
                        writer.remove(child)
                    })
                }
            }
        }
    }

}