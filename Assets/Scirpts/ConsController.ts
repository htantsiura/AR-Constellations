import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import Tween from "LSTween.lspkg/TweenJS/Tween"
import Easing from "LSTween.lspkg/TweenJS/Easing"
import { LSTween } from "LSTween.lspkg/LSTween";
import { Manager } from "./Manager";

@component
export class ConsController extends BaseScriptComponent {

    @input
    mat!: Material;

    @input
    appManager!: Manager;

    private delayEvent!: DelayedCallbackEvent;

    private interactable: Interactable | null = null;
    private objectTransform!: Transform;
    private baseScale!: vec3;
    private hoverScale!: vec3;
    private basePos!: vec3;
    private baseRot!: quat;

    onAwake() {
        this.objectTransform = this.getSceneObject().getTransform()
        this.baseScale = this.objectTransform.getLocalScale()
        this.hoverScale = this.baseScale.uniformScale(1.2);
        this.basePos = this.objectTransform.getLocalPosition()
        this.baseRot = this.objectTransform.getLocalRotation()

        this.createEvent("OnStartEvent").bind(() => this.init() )

        this.createEvent("OnDisableEvent").bind(() => {
            this.objectTransform.setLocalScale(this.baseScale)
        })

        this.delayEvent = this.createEvent("DelayedCallbackEvent")
        this.delayEvent.bind(() => {
            const currentPos = this.objectTransform.getLocalPosition()
            const currentRot = this.objectTransform.getLocalRotation()
            tweenObjectMove(this.objectTransform, currentPos, this.basePos, 250)
            tweenObjectRotate(this.objectTransform, currentRot, this.baseRot, 250)
            tweenObjectRotate(this.appManager.currentCons!.getTransform(), currentRot, this.baseRot, 250)
        })
        //delayEvent.reset(1);
    }

    private init() {

        this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())
        if (!this.interactable) return;

        this.interactable.onHoverEnter.add(() => {
            tweenObjectScale(this.objectTransform, this.baseScale, this.hoverScale, 250)
        })

        this.interactable.onHoverUpdate.add((event) => {
            /* if(event.interactor && event.interactor.isTriggering) return;
            //event.interactor.targetHitPosition — 3D coords (vec3) on the surface of 3D model
            print("Hover UPdate " + event.interactor.targetHitPosition) */
        })

        this.interactable.onHoverExit.add(() => {
            
            
            tweenObjectScale(this.objectTransform, this.hoverScale, this.baseScale, 250)
        })


        this.interactable.onTriggerStart.add(() => {
            this.delayEvent.cancel()
            tweenMatValue(this.mat, "intensity", 0.5, 1, 250)
        })

        this.interactable.onTriggerUpdate.add(() => {

            // default material to pale
            // disable all constellations, except selected one
            const currentRot = this.objectTransform.getLocalRotation()
            this.appManager.rotateByController(currentRot)
        })

        this.interactable.onTriggerEnd.add(() => {
            tweenMatValue(this.mat, "intensity", 1, 0.5, 250)
            this.delayEvent.reset(2);
        })

        this.interactable.onTriggerCanceled.add(() => {
            tweenMatValue(this.mat, "intensity", 1, 0.5, 250)
            this.delayEvent.reset(2);
        })

        this.interactable.onTriggerEndOutside.add(() => {
            tweenMatValue(this.mat, "intensity", 1, 0.5, 250)
            this.delayEvent.reset(2);
        })
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

