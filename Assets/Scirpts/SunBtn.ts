import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import { InteractorInputType } from "SpectaclesInteractionKit.lspkg/Core/Interactor/Interactor";
import { Manager } from "./Manager";
import { CTRL_START_SCALE, CTRL_IDLE_SCALE, CTRL_HOVER_SCALE } from "./Config";

@component
export class ConsBtn extends BaseScriptComponent {

    @input
    sunCard!: SceneObject;

    @input
    appManager!: Manager;

    private interactable: Interactable | null = null;
    private objectTransform!: Transform;



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
}