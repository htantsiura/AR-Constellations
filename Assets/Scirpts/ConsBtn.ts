import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import { InteractorInputType } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { Manager } from "./Manager";
import { CTRL_START_SCALE, CTRL_IDLE_SCALE, CTRL_HOVER_SCALE } from "./Config";

@component
export class ConsBtn extends BaseScriptComponent {

    @input
    mat!: Material;

    @input
    appManager!: Manager;

    @input
    leftHandTarget!: SceneObject;

    @input
    rightHandTarget!: SceneObject;

    @input
    world!: SceneObject;

    @input
    testHandTarget!: SceneObject;

    private delayEvent!: DelayedCallbackEvent;
    private idleUpdateEvent!: UpdateEvent;

    private interactable: Interactable | null = null;
    private objectTransform!: Transform;
    private hoverScale!: vec3;
    private basePos!: vec3;
    private baseRot!: quat;
    private activeHand: number = 0;
    private controlHandTarget!: SceneObject | null;
    private controlIdlePos: vec3 | null = null


    onAwake() {
        this.objectTransform = this.getSceneObject().getTransform()
        this.createEvent("OnStartEvent").bind(() => this.init() )
        this.createEvent("OnDisableEvent").bind(() => {
            this.objectTransform.setLocalScale(CTRL_START_SCALE)
        })
    }

    private init() {
        this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())
        if (!this.interactable) return;

        this.interactable.onHoverEnter.add((event) => {
            this.setHandTarget(event);
            this.appManager.ctrlConsPos = this.objectTransform.getWorldPosition()
            this.appManager.ctrlHandPos = this.controlHandTarget!.getTransform().getWorldPosition()
            this.appManager.ctrlConsRot = this.getSceneObject().getParent().getParent().getTransform().getWorldRotation()
            this.appManager.showController()
        })

        this.interactable.onHoverUpdate.add((event) => {
            
        })

        this.interactable.onHoverExit.add(() => {
 
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

    private setHandTarget(event: any) {
        if (event.interactor.inputType === 1) {
            this.activeHand = 1;
            this.controlHandTarget = this.leftHandTarget
        } else if (event.interactor.inputType === 2) {
            this.activeHand = 2;
            this.controlHandTarget = this.rightHandTarget
        } else {
            this.activeHand = 0;
            this.controlHandTarget = this.testHandTarget
        }
    }
}