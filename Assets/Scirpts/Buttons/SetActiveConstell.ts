import { Manager } from "Scirpts/Manager"

@component
export class SetActiveConstell extends BaseScriptComponent {

    @input
    appManager!: Manager;

    onAwake() {
    }

    public setActiveConsVariable() {
        const parent = this.getSceneObject().getParent().getParent()
        if (parent)
            this.appManager.currentCons = parent;
    }
}
