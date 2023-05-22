import isImageBlock from "./CheckElement";

export function GetImageElements(modelRoot){
    return  Array.from( modelRoot.getChildren()).filter( isImageBlock );
}
