import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import Tween from "LSTween.lspkg/TweenJS/Tween"
import Easing from "LSTween.lspkg/TweenJS/Easing"

@component
export class CustomInteractableFeedback extends BaseScriptComponent {

    private interactable: Interactable | null = null;
    private objectTransform!: Transform;
    private baseScale!: vec3;
    private hoverScale!: vec3;

    onAwake() {
        this.objectTransform = this.getSceneObject().getTransform()
        this.baseScale = this.objectTransform.getLocalScale()
        this.hoverScale = this.baseScale.uniformScale(1.1);

        this.createEvent("OnStartEvent").bind(() => this.init() )

        this.createEvent("OnDisableEvent").bind(() => {
            this.objectTransform.setLocalScale(this.baseScale)
        })

        const delayEvent = this.createEvent("DelayedCallbackEvent")
        delayEvent.bind(() => {
            print("delay");
        })
        //delayEvent.reset(1);
    }

    private init() {

        this.interactable = this.getSceneObject().getComponent(Interactable.getTypeName())
        if (!this.interactable) return;

        this.interactable.onHoverEnter.add(() => {
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
        })
    }
}
