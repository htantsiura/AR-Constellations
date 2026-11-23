import { Manager } from "Scirpts/Manager"
import { starsMap } from "Scirpts/Config";

@component
export class SetActiveStar extends BaseScriptComponent {

    @input
    appManager!: Manager;

    @input
    button!: SceneObject;

    onAwake() {
    }

    public setActiveStarVariable() {
        const name = this.button.getChild(0).getComponent("Component.Text").text
        print ("name " + name)
        const obj = starsMap.get(name.toLowerCase())!.object
        if (obj)
            this.appManager.currentObj = obj;
    }
}
