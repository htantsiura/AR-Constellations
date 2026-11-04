import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import { InteractorInputType } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { Manager } from "./Manager";
import { CTRL_START_SCALE, CTRL_IDLE_SCALE, CTRL_HOVER_SCALE, TW_TIME  } from "./Config";
import { tweenObjectMove, tweenObjectScale } from "./Utils/MyTweenFuncs";
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";

@component
export class Controller extends BaseScriptComponent {

    @input
    mat!: Material;

    @input
    appManager!: Manager;

    private interactable: Interactable | null = null;
    private objectTrf!: Transform;
    private delayEvent!: DelayedCallbackEvent; 
    

    onAwake() {
        this.objectTrf = this.getSceneObject().getTransform()

        this.createEvent("OnStartEvent").bind(() => this.init() )
        this.createEvent("OnDisableEvent").bind(() => {
            this.objectTrf.setLocalScale(CTRL_START_SCALE)
        })

        this.delayEvent = this.createEvent("DelayedCallbackEvent")
        this.delayEvent.bind(() => {
            print("DELAY")
            this.appManager.ctrlConsPos = this.appManager.currentCons!.getChild(0).getChild(4).getTransform().getWorldPosition()
            this.appManager.ctrlHandPos = this.objectTrf.getWorldPosition()
            this.appManager.hideController()

        }) 
        //delayEvent.reset(1);
    }

    private init() {

        this.delayEvent.reset(5)

        this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())
        if (!this.interactable) return;

        this.interactable.onHoverEnter.add((event) => {
            tweenObjectScale(this.objectTrf, CTRL_IDLE_SCALE, CTRL_HOVER_SCALE, TW_TIME)
            this.delayEvent.enabled = false;
        })

        this.interactable.onHoverUpdate.add((event) => {
            
        })

        this.interactable.onHoverExit.add(() => {
            tweenObjectScale(this.objectTrf, CTRL_HOVER_SCALE, CTRL_IDLE_SCALE, TW_TIME)
            this.delayEvent.enabled = true;
            this.delayEvent.reset(2)
            
        })


        this.interactable.onTriggerStart.add((event) => {
            this.mat.mainPass.rimIntensity = 2;
            this.delayEvent.enabled = false;

        })

        this.interactable.onTriggerUpdate.add(() => {
            const rot = this.objectTrf.getWorldRotation()
            this.appManager.currentCons!.getTransform().setWorldRotation(rot)
        })

        this.interactable.onTriggerEnd.add(() => {
            this.mat.mainPass.rimIntensity = 1;

        })

        this.interactable.onTriggerCanceled.add(() => {
            this.delayEvent.enabled = true;
            this.mat.mainPass.rimIntensity = 1;
            this.delayEvent.reset(2)
        })

        this.interactable.onTriggerEndOutside.add(() => {
            this.delayEvent.enabled = true;
            this.mat.mainPass.rimIntensity = 1;
            this.delayEvent.reset(2)
        })
    }
}

