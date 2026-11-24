import { Manager } from "Scirpts/Manager"
import { consMap } from "Scirpts/Config";
import { toTitleCase } from "Scirpts/Utils/Utils";

@component
export class SetActiveConstell extends BaseScriptComponent {

    @input
    appManager!: Manager;

    onAwake() {
    }

    public setActiveConsVariable() {
        const parent = this.getSceneObject().getParent().getParent()
        if (parent)
            this.appManager.currentObj = parent;
    }

    public setActiveConsVariableFromStar() {
        let objName = this.getSceneObject().getChild(0).getComponent("Component.Text").text
        objName = toTitleCase(objName)
        const obj = consMap.get(objName)!.object
        if (obj)
        {
            this.appManager.currentObj = obj;
        }        
    }
}
