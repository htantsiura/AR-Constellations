import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import { InteractorInputType } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import Tween from "LSTween.lspkg/TweenJS/Tween"
import Easing from "LSTween.lspkg/TweenJS/Easing"
import { LSTween } from "LSTween.lspkg/LSTween";
import { Manager } from "./Manager";
import { CTRL_START_SCALE, CTRL_IDLE_SCALE, CTRL_HOVER_SCALE} from "./Config";

@component
export class ControllerBtn extends BaseScriptComponent {

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
        this.basePos = this.objectTransform.getLocalPosition()
        this.baseRot = this.objectTransform.getLocalRotation()

        this.createEvent("OnStartEvent").bind(() => this.init() )
        this.createEvent("OnDisableEvent").bind(() => {
            this.objectTransform.setLocalScale(CTRL_START_SCALE)
        })

        this.delayEvent = this.createEvent("DelayedCallbackEvent")
        this.delayEvent.bind(() => {
            const currentPos = this.objectTransform.getLocalPosition()
            const currentRot = this.objectTransform.getLocalRotation()
            tweenObjectRotate(this.objectTransform, currentRot, this.baseRot, 250)
            tweenObjectRotate(this.appManager.currentCons!.getTransform(), currentRot, this.baseRot, 250)
        })
        //delayEvent.reset(1);
    }

    private init() {
       this.idleUpdateEvent.enabled = true;

        this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())
        if (!this.interactable) return;

        this.interactable.onHoverEnter.add((event) => {
            this.setHandTarget(event);
            if(!this.activeHand) return;
            const endPos = this.controlHandTarget?.getTransform().getWorldPosition()
            const startPos = this.objectTransform.getWorldPosition();
            const rot = this.objectTransform.getWorldRotation();
            //this.appManager.turnOnController(startPos, endPos!, rot)
            
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
            print("in preview");
        }
    }
}

export function tweenMatValue(mat: Material, scriptName: string, a: number, b: number, time: number) {
    LSTween.shaderFloatPropertyFromTo(
        mat.mainPass, 
        scriptName,
        a,
        b,
        time
    )
    .repeat(0)
    .yoyo(false)
    .easing(Easing.Quadratic.Out)
    .start()
}

export function tweenObjectScale(transform: Transform, a: vec3, b: vec3, time: number) {
    LSTween.scaleFromToLocal(
        transform, 
        a,
        b,
        time
    )
    .repeat(0)
    .yoyo(false)
    .easing(Easing.Quadratic.Out)
    .start()
}

export function tweenObjectMove(transform: Transform, a: vec3, b: vec3, time: number) {
    LSTween.moveFromToLocal(
        transform, 
        a,
        b,
        time
    )
    .repeat(0)
    .yoyo(false)
    .easing(Easing.Quadratic.Out)
    .start()
}

export function tweenObjectRotate(transform: Transform, a: quat, b: quat, time: number) {
    LSTween.rotateFromToLocal(
        transform, 
        a,
        b,
        time
    )
    .repeat(0)
    .yoyo(false)
    .easing(Easing.Quadratic.Out)
    .start()
}