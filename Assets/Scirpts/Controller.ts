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

    private delayEvent: any; 



    onAwake() {
        this.objectTrf = this.getSceneObject().getTransform()

        this.createEvent("OnStartEvent").bind(() => this.init() )
        this.createEvent("OnDisableEvent").bind(() => {
            this.objectTrf.setLocalScale(CTRL_START_SCALE)
        })

        this.delayEvent = this.createEvent("DelayedCallbackEvent")
        this.delayEvent.bind(() => {

        }) 
        //delayEvent.reset(1);
    }

    private init() {

        this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())
        if (!this.interactable) return;

        this.interactable.onHoverEnter.add((event) => {
            tweenObjectScale(this.objectTrf, CTRL_IDLE_SCALE, CTRL_HOVER_SCALE, TW_TIME)
        })

        this.interactable.onHoverUpdate.add((event) => {
            
        })

        this.interactable.onHoverExit.add(() => {
            tweenObjectScale(this.objectTrf, CTRL_HOVER_SCALE, CTRL_IDLE_SCALE, TW_TIME)
        })


        this.interactable.onTriggerStart.add((event) => {

        })

        this.interactable.onTriggerUpdate.add(() => {

        })

        this.interactable.onTriggerEnd.add(() => {

        })

        this.interactable.onTriggerCanceled.add(() => {

        })

        this.interactable.onTriggerEndOutside.add(() => {

        })
    }
}

