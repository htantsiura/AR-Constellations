import { CardContentUpdate } from "./CardContentUpdate";
import { StarCardContentUpdate } from "./StarCardContentUpdate";

@component
export class CardsManager extends BaseScriptComponent {

    @input consCard!: SceneObject;
    @input content!: SceneObject;
    @input list!: SceneObject;
    @input listOfStarsBtn!: SceneObject;
    @input closeConsBtn!: SceneObject;

    @ui.separator

    @input starCard!: SceneObject;
    @input closeStarBtn!: SceneObject;
    @input backToListBtn!: SceneObject;

    @ui.separator

    @input sunCard!: SceneObject;
    @input closeSunBtn!: SceneObject;

    @ui.separator

    @input infoCard!: SceneObject;
    @input closeInfoBtn!: SceneObject;

    @ui.separator

    @input cardContentUpdateScript!: CardContentUpdate;
    @input starCardContentUpdateScript!: StarCardContentUpdate;
    @input target!: SceneObject;

    private delayEvent!: DelayedCallbackEvent;

    onAwake() 
    {
        this.delayEvent = this.createEvent("DelayedCallbackEvent")
        this.delayEvent.bind(() => {
            this.list!.enabled = true;
        })

        this.consCard.enabled = false;
        this.starCard.enabled = false;
        this.sunCard.enabled = false;
        this.infoCard.enabled = true;

        this.list!.enabled = false;
        this.content!.getChild(1).enabled = true;
        this.content!.getChild(2).enabled = true;
        this.closeConsBtn!.enabled = true;
        this.listOfStarsBtn!.enabled = true;
    }

    public openConsCard(obj: SceneObject): void
    {
        this.consCard.enabled = true;
        this.starCard.enabled = false;
        this.sunCard.enabled = false;
        this.infoCard.enabled = false;

        this.cardContentUpdateScript.contentUpdate(obj);
        this.list!.enabled = false;
        this.content!.getChild(1).enabled = true;
        this.content!.getChild(2).enabled = true;
        this.closeConsBtn!.enabled = true;
        this.listOfStarsBtn!.enabled = true;

        const pos = this.target.getTransform().getWorldPosition();
        const rot = this.target.getTransform().getWorldRotation();
        //this.consCard.getTransform().setWorldPosition(new vec3(pos.x, pos.y -15, pos.z));
        this.consCard.getTransform().setWorldPosition(pos);
        this.consCard.getTransform().setWorldRotation(rot);

    }

    public openStarCard(obj: SceneObject): void
    {
        this.consCard.enabled = false;
        this.starCard.enabled = true;
        this.sunCard.enabled = false;
        this.infoCard.enabled = false;

        this.starCardContentUpdateScript.contentUpdate(obj);
        const pos = this.target.getTransform().getWorldPosition();
        const rot = this.target.getTransform().getWorldRotation();
        this.starCard.getTransform().setWorldPosition(pos);
        this.starCard.getTransform().setWorldRotation(rot);
    }

    public openSunCard(): void
    {
        this.consCard.enabled = false;
        this.starCard.enabled = false;
        this.infoCard.enabled = false;

        this.sunCard.enabled = !this.sunCard.enabled ;
    }

    public toggleConsCard(): void {
        this.consCard.enabled = !this.consCard.enabled ;
    }

    public toggleStarCard(): void {
        this.starCard.enabled = !this.starCard.enabled ;
    }

    public toggleList(): void {
        this.list.enabled = !this.list.enabled ;
    }

    public showListOfStars(): void 
    {
        this.list!.enabled = true;
        //this.delayEvent.reset(1);

        this.content!.getChild(1).enabled = false;
        this.content!.getChild(2).enabled = false;
        this.closeConsBtn!.enabled = false;
        this.listOfStarsBtn!.enabled = false;
    }

    public hideListOfStars(): void 
    {
        this.list!.enabled = false;

        this.content!.getChild(1).enabled = true;
        this.content!.getChild(2).enabled = true;
        this.closeConsBtn!.enabled = true;
        this.listOfStarsBtn!.enabled = true;
    }

    public backListOfStars(): void {

        this.consCard.enabled = true;
        this.starCard.enabled = false;
        this.list!.enabled = true;

        this.content!.getChild(1).enabled = false;
        this.content!.getChild(2).enabled = false;
        this.closeConsBtn!.enabled = false;
        this.listOfStarsBtn!.enabled = false; 
    }

    public closeConsCard() {
        this.consCard.enabled = false;
    }

    public closeStarCard() {
        this.starCard.enabled = false;
    }

    public closeSunCard() {
        this.sunCard.enabled = false;
    }

    public closeInfoCard() {
        this.infoCard.enabled = false;
    }
}
