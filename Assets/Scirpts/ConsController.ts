import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import { InteractorInputType } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import Tween from "LSTween.lspkg/TweenJS/Tween"
import Easing from "LSTween.lspkg/TweenJS/Easing"
import { LSTween } from "LSTween.lspkg/LSTween";
import { Manager } from "./Manager";
import { CONTROL_HOVER, CONTROL_IDLE, CONTROL_LOC_POS } from "./Config";

@component
export class ConsController extends BaseScriptComponent {

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
            this.objectTransform.setLocalScale(CONTROL_IDLE)
        })

        this.delayEvent = this.createEvent("DelayedCallbackEvent")
        this.delayEvent.bind(() => {
            const currentPos = this.objectTransform.getLocalPosition()
            const currentRot = this.objectTransform.getLocalRotation()
            this.getSceneObject().setParentPreserveWorldTransform(this.appManager.currentCons!);
            //this.controlIdlePos = this.appManager.controlIdlePos;
            //NOT RETURN BY MOVE, but Pop Up by scale
            tweenObjectMove(this.objectTransform, currentPos, CONTROL_LOC_POS, 250)
            tweenObjectRotate(this.objectTransform, currentRot, this.baseRot, 250)
            tweenObjectRotate(this.appManager.currentCons!.getTransform(), currentRot, this.baseRot, 250)
        })
        //delayEvent.reset(1);
    }

    private init() {

        this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())
        if (!this.interactable) return;

        this.interactable.onHoverEnter.add((event) => {
            this.setHandTarget(event);
            tweenObjectScale(this.objectTransform, CONTROL_IDLE, CONTROL_HOVER, 250)
            const handPos = this.controlHandTarget?.getTransform().getWorldPosition();
            if(!handPos) return;
            this.getSceneObject().setParentPreserveWorldTransform(this.world);
            this.objectTransform.setWorldPosition(handPos)
        })

        this.interactable.onHoverUpdate.add((event) => {
            
        })

        this.interactable.onHoverExit.add(() => {
            this.activeHand = 0;
            this.delayEvent.reset(2);
            tweenObjectScale(this.objectTransform, CONTROL_HOVER, CONTROL_IDLE, 250)
        })


        this.interactable.onTriggerStart.add((event) => {
            this.delayEvent.cancel()
            tweenMatValue(this.mat, "rimIntensity", 0.5, 1, 250)
        })

        this.interactable.onTriggerUpdate.add(() => {

            // default material to pale
            // disable all constellations, except selected one
            const currentRot = this.objectTransform.getLocalRotation()
            this.appManager.rotateByController(currentRot)
        })

        this.interactable.onTriggerEnd.add(() => {
            tweenMatValue(this.mat, "rimIntensity", 1, 0.5, 250)
            this.delayEvent.reset(2);
        })

        this.interactable.onTriggerCanceled.add(() => {
            tweenMatValue(this.mat, "rimIntensity", 1, 0.5, 250)
            this.delayEvent.reset(2);
        })

        this.interactable.onTriggerEndOutside.add(() => {
            tweenMatValue(this.mat, "rimIntensity", 1, 0.5, 250)
            this.delayEvent.reset(2);
            this.activeHand = 0;
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





/* this.interactable.onHoverEnter.add(() => {
    print("Hover Enter")
})

this.interactable.onHoverUpdate.add((event) => {
    if(event.interactor && event.interactor.isTriggering) return;
    //event.interactor.targetHitPosition — 3D coords (vec3) on the surface of 3D model
    print("Hover UPdate " + event.interactor.targetHitPosition)
})

this.interactable.onHoverExit.add(() => {
    print("Hover Exit")
})


this.interactable.onTriggerStart.add(() => {
    print("Pinch Start")
})

this.interactable.onTriggerUpdate.add(() => {
    print("Pinch Update")
})

this.interactable.onTriggerEnd.add(() => {
    print("Pinch End")
})

this.interactable.onTriggerCanceled.add(() => {
    print("Pinch Canceled, hand tracking lost")
})

this.interactable.onTriggerEndOutside.add(() => {
    print("Pinch Ended/Canceled outside")
}) */

