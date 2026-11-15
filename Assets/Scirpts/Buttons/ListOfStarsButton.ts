@component
export class ListOfStarsButton extends BaseScriptComponent {

    @input
    starList: SceneObject | null = null;

    @input
    content: SceneObject | null = null;
    
    onAwake() {
        this.starList!.enabled = false;
        this.content!.enabled = true;
    }

    public showListOfStars(): void {
        this.starList!.enabled = true;
        this.content!.enabled = false;
    }

    public hideListOfStars(): void {
        this.starList!.enabled = false;
        this.content!.enabled = true;
    }
}
