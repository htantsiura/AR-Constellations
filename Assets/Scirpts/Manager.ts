import Easing from "LSTween.lspkg/TweenJS/Easing";
import { CardContentUpdate } from "./Cards/CardContentUpdate";
import { turnOnAllStarsLabels, turnOffAllStarsLabels, setActiveLineMaterial, setDefaultLineMaterial, turnOnOffControllerBtn } from "./VisibilitiModes";
import { LSTween } from "LSTween.lspkg/LSTween";
import { consQuatMap, CTRL_START_SCALE, CTRL_IDLE_SCALE, CTRL_HOVER_SCALE , TW_TIME } from "./Config";
import { getChildByName } from "./Utils";
import { tweenObjectMove, tweenObjectScale } from "./Utils/MyTweenFuncs";

@component
export class Manager extends BaseScriptComponent {

    @input
    card!: SceneObject;

    @input
    cardContentUpdateScript!: CardContentUpdate;

    @input
    defaultLineMat!: Material;

    @input
    activeLineMat!: Material;

    @input
    sun!: SceneObject;

    @input
    target!: SceneObject;

    @input
    world!: SceneObject;

    @input
    controller!: SceneObject;

    @input
    testController!: SceneObject;

 

    public currentCons: SceneObject | null = null;
    public prevCons: SceneObject | null = null;

    public currentConsPos: vec3 | null = null;

    //Controller vars
    public controlIdlePos: vec3 | null = null;
    public ctrlConsPos: vec3 | null = null;
    public ctrlHandPos: vec3 | null = null;
    public ctrlConsRot: quat | null = null;
    public isController!: boolean;
    private controllerTrf = this.controller.getTransform();

    
    onAwake() {
        this.card.enabled = false;
        this.controller.enabled = false;
        this.isController = false;

        
        //this.rotateWorldToTarget();
    }

    private onStart(): void {
        
    }

    public openConsCard() {
        this.cardContentUpdateScript.contentUpdate(this.currentCons);
        this.card.enabled = true;
    }

    public activateConstellation() {
        if (this.prevCons === this.currentCons) return

        if (this.prevCons) {
            turnOffAllStarsLabels(this.prevCons)
            setDefaultLineMaterial(this.prevCons, this.defaultLineMat)
            this.hideShowConsBtn(this.prevCons, false)
            //this.controller.enabled = false;
        }
        this.currentCons!.getChild(0).getChild(3).getComponent("Component.AudioComponent").play(1);
        this.rotateWorldToTarget(this.currentCons!)
        turnOnAllStarsLabels(this.currentCons!) 
        setActiveLineMaterial(this.currentCons!, this.activeLineMat)
        this.hideShowConsBtn(this.currentCons, true)
        this.openConsCard()
        this.prevCons = this.currentCons; 
    }

    public showController() {
        if(!this.currentCons || this.isController) return;
        this.controllerTrf.setWorldPosition(this.ctrlConsPos!)
        this.controllerTrf.setWorldRotation(this.ctrlConsRot!)
        this.controller.enabled = true;
        tweenObjectMove(this.controllerTrf, this.ctrlConsPos!, this.ctrlHandPos!, TW_TIME)
        tweenObjectScale(this.controllerTrf, CTRL_START_SCALE, CTRL_IDLE_SCALE, TW_TIME)

        this.isController = true;
        this.hideShowConsBtn(this.currentCons, false)
    }

    public hideController() {
        if(!this.currentCons || !this.isController) return;
        this.controller.enabled = false;
        this.isController = false;

        this.hideShowConsBtn(this.currentCons, false)
        this.hideShowConsBtn(this.prevCons, false)
    }

    private hideShowConsBtn(cons: SceneObject | null, state: boolean) {
        if(!cons) return;
        const btn = cons.getChild(0).getChild(4)
        if(btn && btn.name === "btn") {
            btn.enabled = state;
        }
    }

    public openConsCardByVoice(args: any) {
        const consName = args.text.replace(/[.,!?]/g, "").trim();
        const consObj = getChildByName(this.world, consName);
        if (!consObj) return;

        this.currentCons = consObj;
        this.activateConstellation()
    }

    public rotateWorldToTarget(currentCons: SceneObject) {

        const worldTransform = this.world.getTransform();
    
        //getting base constellation Rot from Map
        const consName = currentCons.name.replace(/[.,!?]/g, "").trim() //args.text.replace(/[.,!?]/g, "").trim().toLowerCase();
        const baseConsRot = consQuatMap.get(consName);

        // getting targetRot
        const worldPos = this.world.getTransform().getWorldPosition();
        const targetPos = this.target.getTransform().getWorldPosition();
        this.currentConsPos = targetPos;
        const targetAngle = Math.atan2(worldPos.x - targetPos.x, worldPos.z - targetPos.z);
        const targetRot = quat.angleAxis(targetAngle, vec3.up());

        // by multiplying quaternions - getting the rotation
        const finalRot = targetRot.multiply(baseConsRot!);

        LSTween.rotateToLocal(
            worldTransform, 
            finalRot,
            1000
        )
        .easing(Easing.Quadratic.InOut)
        .start()
        .onComplete(() => {
           // this.setControllerToCons(currentCons);
        })
    }

    public rotateByController(rotation: quat) {
        this.currentCons?.getTransform().setLocalRotation(rotation)
    }

    /* private setControllerToCons(cons: SceneObject) {
        this.controller.getTransform().setWorldScale(new vec3(0, 0, 0))
        this.controller.enabled = true;
    }

    public turnOnController(startPos: vec3, endPos: vec3, rot: quat) {
        this.controllerTrf.setWorldPosition(endPos)
        //this.controllerTrf.setWorldRotation(rot)
        this.controller.enabled = true;
        tweenObjectMove(this.controller.getTransform(), startPos, endPos, TW_TIME)
    } */
}


