import { Manager } from "Scirpts/Manager";
import { getChildByName } from "Scirpts/Utils";

@component
export class ListOfStarsButton extends BaseScriptComponent {

    @input
    list: SceneObject | null = null;

    @input
    content: SceneObject | null = null;

    
    onAwake() {
        /* this.starList!.enabled = false; */
        this.content!.enabled = true;
    }

    public showListOfStars(): void {
        /* const obj = getChildByName(this.list!, "Star Buttons Scroll List")
            if (!obj) return;
        obj.destroy(); */
        print("TURN ON THE LIST")
        this.list!.enabled = true;

        

        /* this.starList!.enabled = true; */
        //this.content!.enabled = false;
    }

    public hideListOfStars(): void {

        /* this.starList!.enabled = false; */
        this.content!.enabled = true;
    }
}
