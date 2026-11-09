import Easing from "LSTween.lspkg/TweenJS/Easing";
import { CardContentUpdate } from "./Cards/CardContentUpdate";
import { changeMatSlider, consIdleToActiveVisibility, consActiveToIdleVisibility } from "./VisibilitiModes";
import { LSTween } from "LSTween.lspkg/LSTween";
import { consQuatMap, CTRL_START_SCALE, CTRL_IDLE_SCALE, BTN_SCALE, ZERO_QUAT, TW_TIME, LINE_MODE } from "./Config";
import { getChildByName } from "./Utils";
import { tweenObjectMove, tweenObjectScale, tweenObjectRotateTo, tweenObjectMoveAndState } from "./Utils/MyTweenFuncs";
import { tweenObjectRotate } from "./ControllerBtn";

@component
export class Manager extends BaseScriptComponent {
   
    @input controller!: SceneObject;
    @input target!: SceneObject;
    @input world!: SceneObject;
    @input sun!: SceneObject;

    @ui.separator

    @input card!: SceneObject;
    @input sunCard!: SceneObject;
    @input cardContentUpdateScript!: CardContentUpdate;
    @input startInfoCard!: SceneObject;

    @ui.separator

    @ui.group_start("Materials")
    @input defaultLineMat!: Material;
    @input activeLineMat!: Material;
    @input defaultStarMat!: Material;
    @input activeStarMat!: Material;
    @ui.group_end

    public currentCons: SceneObject | null = null;
    public prevCons: SceneObject | null = null;
    public currentConsPos: vec3 | null = null;
    //stars
    public currentStar: SceneObject | null = null;
    public prevStar: SceneObject | null = null;

    //Controller vars
    public controlIdlePos: vec3 | null = null;
    public ctrlConsPos: vec3 | null = null;
    public ctrlHandPos: vec3 | null = null;
    public ctrlConsRot: quat | null = null;
    public isController!: boolean;
    private controllerTrf = this.controller.getTransform();

    
    onAwake() {
        this.card.enabled = false;
        this.sunCard.enabled = false;
        this.controller.enabled = false;
        this.isController = false;
    }

    private onStart(): void {
        
    }

    public openConsCard() {
        this.sunCard.enabled = false;
        this.cardContentUpdateScript.contentUpdate(this.currentCons);
        this.card.enabled = true;
    }

    public openSunCard() {
        this.sunCard.enabled = !this.sunCard.enabled ;
        this.card.enabled = false;
    }

    public activateConstellation() {
        this.startInfoCard.enabled = false;
        print( "zero rotation quat " + this.controller.getTransform().getWorldRotation())
        if (this.prevCons === this.currentCons) return

        if (this.prevCons) {
            consActiveToIdleVisibility(this.prevCons, this.defaultStarMat, this.defaultLineMat)
            this.hideShowConsBtn(this.prevCons, false)
        }
        this.currentCons!.getChild(0).getChild(3).getComponent("Component.AudioComponent").play(1);
        this.rotateWorldToTarget(this.currentCons!)
        consIdleToActiveVisibility(this.currentCons!, this.activeStarMat, this.activeLineMat)
        this.hideShowConsBtn(this.currentCons, true)
        this.openConsCard()
        this.prevCons = this.currentCons; 
    }

    public showController() {
        if(!this.currentCons || this.isController) return;
        this.controllerTrf.setWorldPosition(this.ctrlConsPos!)
        this.controllerTrf.setWorldRotation(this.ctrlConsRot!)
        this.controller.enabled = true;
        
        changeMatSlider(this.defaultLineMat, LINE_MODE.idle, LINE_MODE.pale)
        changeMatSlider(this.defaultStarMat, 1, 0)
        tweenObjectMove(this.controllerTrf, this.ctrlConsPos!, this.ctrlHandPos!, TW_TIME)
        tweenObjectScale(this.controllerTrf, CTRL_START_SCALE, CTRL_IDLE_SCALE, TW_TIME)

        this.isController = true;
        this.hideShowConsBtn(this.currentCons, false)
    }

    public hideController() {
        if(!this.currentCons || !this.isController) return;
        this.isController = false;
        
        changeMatSlider(this.defaultLineMat, LINE_MODE.pale, LINE_MODE.idle)
        changeMatSlider(this.defaultStarMat, 0, 1)
        tweenObjectScale(this.controllerTrf, CTRL_IDLE_SCALE, CTRL_START_SCALE, TW_TIME)
        tweenObjectRotateTo(this.controllerTrf, this.ctrlConsRot!, TW_TIME)
        tweenObjectRotateTo(this.currentCons.getTransform(), ZERO_QUAT, TW_TIME)
        LSTween.moveFromToLocal(
            this.controllerTrf, 
            this.ctrlHandPos!,
            this.ctrlConsPos!,
            TW_TIME
        )
        .repeat(0)
        .yoyo(false)
        .easing(Easing.Quadratic.Out)
        .start()
        .onComplete(() => {
            this.controller.enabled = false;
            this.hideShowConsBtn(this.currentCons, true)
        })
    }

    private hideShowConsBtn(cons: SceneObject | null, state: boolean) {
        if(!cons) return;
        const btn = cons.getChild(0).getChild(4)
        btn.getTransform().setLocalScale(BTN_SCALE)
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
    
        const consName = currentCons.name.replace(/[.,!?]/g, "").trim() 
        const baseConsRot = consQuatMap.get(consName);

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

    }

    public rotateByController(rotation: quat) {
        this.currentCons?.getTransform().setLocalRotation(rotation)
    }
}


