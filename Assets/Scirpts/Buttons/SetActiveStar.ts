import { Manager } from "Scirpts/Manager"
import { idStarMainInfoMap } from "Scirpts/Config";

@component
export class SetActiveStar extends BaseScriptComponent {

    @input
    appManager!: Manager;

    @input
    button!: SceneObject;

    onAwake() {
    }

    public setActiveStarVariable() {
        const obj = idStarMainInfoMap.get(this.button.name)!.object
        //const parent = this.getSceneObject().getParent().getParent()
        if (obj)
            this.appManager.currentObj = obj;
    }
}
