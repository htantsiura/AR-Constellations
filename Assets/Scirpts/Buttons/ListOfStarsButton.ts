import { Manager } from "Scirpts/Manager";
import { getChildByName } from "Scirpts/Utils/Utils";

@component
export class ListOfStarsButton extends BaseScriptComponent {

    @input
    button: SceneObject | null = null;

    @input
    list: SceneObject | null = null;

    @input
    content: SceneObject | null = null;

    @input
    closeBtn1: SceneObject | null = null;

    public onShow: (() => void) | null = null;
  
    onAwake() 
    {
        this.list!.enabled = false;
        
        this.content!.getChild(1).enabled = true;
        this.content!.getChild(2).enabled = true;
        this.closeBtn1!.enabled = true;
        this.button!.enabled = true;
    }

    public showListOfStars(): void 
    {
        this.list!.enabled = true;
        if (this.onShow) this.onShow();

        this.content!.getChild(1).enabled = false;
        this.content!.getChild(2).enabled = false;
        this.closeBtn1!.enabled = false;
        this.button!.enabled = false;
    }

    public hideListOfStars(): void 
    {
        this.list!.enabled = false;

        this.content!.getChild(1).enabled = true;
        this.content!.getChild(2).enabled = true;
        this.closeBtn1!.enabled = true;
        this.button!.enabled = true;
    }
}
