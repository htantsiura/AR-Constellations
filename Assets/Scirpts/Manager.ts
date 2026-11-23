import Easing from "LSTween.lspkg/TweenJS/Easing";
import { CardContentUpdate } from "./Cards/CardContentUpdate";
import { changeMatSlider, consIdleToActiveVisibility, consActiveToIdleVisibility, 
    starIdleToActiveVisibility, starActiveToIdleVisibility,
    starActiveToSelectedVisibility, starSelectedToActiveVisibility } from "./VisibilitiModes";
import { LSTween } from "LSTween.lspkg/LSTween";
import { consMap, starsMap, CTRL_START_SCALE, CTRL_IDLE_SCALE, BTN_SCALE, ZERO_QUAT, TW_TIME, LINE_MODE } from "./Config";
import { getChildByName } from "./Utils";
import { tweenObjectMove, tweenObjectScale, tweenObjectRotateTo, tweenObjectMoveAndState } from "./Utils/MyTweenFuncs";
import { tweenObjectRotate } from "./ControllerBtn";
import { ConstellationData } from "./Data/ConstellationData";
import { GridLayout } from "SpectaclesUIKit.lspkg/Scripts/Components/GridLayout/GridLayout";
import { ScrollWindow } from "SpectaclesUIKit.lspkg/Scripts/Components/ScrollWindow/ScrollWindow";
import { ListOfStarsButton } from "./Buttons/ListOfStarsButton";
import { StarCardContentUpdate } from "./Cards/StarCardContentUpdate";
import { CardsManager } from "./Cards/CardsManager";

@component
export class Manager extends BaseScriptComponent {
   
    @input controller!: SceneObject;
    @input target!: SceneObject;
    @input world!: SceneObject;
    @input sun!: SceneObject;

    @ui.separator

    @input card!: SceneObject;
    @input sunCard!: SceneObject;
    @input starCard!: SceneObject;
    @input startInfoCard!: SceneObject;
    @input cardContentUpdateScript!: CardContentUpdate;
    @input starCardContentUpdateScript!: StarCardContentUpdate;
    @input cardsManagerScript!: CardsManager;
    
    @ui.separator

    @input starButton!: ObjectPrefab;
    @input starList!: ObjectPrefab;
    @input list!: SceneObject;
    @input listOfStarsBtnScript!: ListOfStarsButton;
    @input scrollWindow!: ScrollWindow;
    @input gridLayout!: GridLayout;

    @ui.separator

    @ui.group_start("Materials")
    @input defaultLineMat!: Material;
    @input activeLineMat!: Material;
    @input defaultStarMat!: Material;
    @input activeStarMat!: Material;
    @input selectedStarMat!: Material;
    @ui.group_end

    public currentObj: SceneObject | null = null;
    public previousObj: SceneObject | null = null;
    public currentObjPos: vec3 | null = null;
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
        this.controller.enabled = false;
        this.isController = false;
    }

    private onStart(): void {
        this.card.enabled = true;
    }

    /* public openSunCard(): void
    {
        this.card.enabled = false;
        this.starCard.enabled = false;
        this.startInfoCard.enabled = false;

        this.sunCard.enabled = !this.sunCard.enabled ;
    } */

    public activateConstellation() {
        
        if (this.previousObj === this.currentObj) 
        {
            this.cardsManagerScript.toggleConsCard()
            return;
        }
        if (this.previousObj) {
            if (this.previousObj.name == "s_label") {
                starActiveToIdleVisibility( this.previousObj, this.defaultStarMat)
                consActiveToIdleVisibility(this.previousObj.getParent(), this.defaultStarMat, this.defaultLineMat)

            } else {
                consActiveToIdleVisibility(this.previousObj, this.defaultStarMat, this.defaultLineMat)
                this.hideShowConsBtn(this.previousObj, false)
                this.listOfStarsBtnScript.hideListOfStars();
                //starActiveToIdleVisibility(this.previousObj, this.defaultStarMat)
            }
        }
        this.currentObj!.getChild(0).getChild(3).getComponent("Component.AudioComponent").play(1);
        this.rotateWorldToConsTarget(this.currentObj!)
        consIdleToActiveVisibility(this.currentObj!, this.activeStarMat, this.activeLineMat)
        this.hideShowConsBtn(this.currentObj, true)
        this.cardsManagerScript.openConsCard(this.currentObj!)
        this.updateStarButtonList()
        this.previousObj = this.currentObj; 
    }

    public activateStar() {

        if (this.previousObj === this.currentObj) return;

        if (this.previousObj) {
            if (this.previousObj.name == "s_label") {
                starActiveToIdleVisibility( this.previousObj, this.defaultStarMat)
            } else {
                consActiveToIdleVisibility(this.previousObj, this.activeStarMat, this.activeLineMat)
                this.hideShowConsBtn(this.previousObj, false)
                this.listOfStarsBtnScript.hideListOfStars();
                //starActiveToIdleVisibility(this.previousObj, this.defaultStarMat)
            }
        }
        this.rotateWorldToConsTarget(this.currentObj!)
        starActiveToSelectedVisibility(this.currentObj!, this.selectedStarMat)
        this.cardsManagerScript.openStarCard(this.currentObj!)
        this.previousObj = this.currentObj; 
    }

    public showController() {
        if(!this.currentObj || this.isController) return;
        this.controllerTrf.setWorldPosition(this.ctrlConsPos!)
        this.controllerTrf.setWorldRotation(this.ctrlConsRot!)
        this.controller.enabled = true;
        
        changeMatSlider(this.defaultLineMat, LINE_MODE.idle, LINE_MODE.pale)
        changeMatSlider(this.defaultStarMat, 1, 0)
        tweenObjectMove(this.controllerTrf, this.ctrlConsPos!, this.ctrlHandPos!, TW_TIME)
        tweenObjectScale(this.controllerTrf, CTRL_START_SCALE, CTRL_IDLE_SCALE, TW_TIME)

        this.isController = true;
        this.hideShowConsBtn(this.currentObj, false)
    }

    public hideController() {
        if(!this.currentObj || !this.isController) return;
        this.isController = false;
        
        changeMatSlider(this.defaultLineMat, LINE_MODE.pale, LINE_MODE.idle)
        changeMatSlider(this.defaultStarMat, 0, 1)
        tweenObjectScale(this.controllerTrf, CTRL_IDLE_SCALE, CTRL_START_SCALE, TW_TIME)
        tweenObjectRotateTo(this.controllerTrf, this.ctrlConsRot!, TW_TIME)
        tweenObjectRotateTo(this.currentObj.getTransform(), ZERO_QUAT, TW_TIME)
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
            this.hideShowConsBtn(this.currentObj, true)
        })
    }

    private hideShowConsBtn(obj: SceneObject | null, state: boolean) {
        if(!obj) return;
        if (obj.name === "s_label") {

        } else {
            const btn = obj.getChild(0).getChild(4)
            btn.getTransform().setLocalScale(BTN_SCALE)
            if(btn && btn.name === "btn") {
                btn.enabled = state;
            }
        }
    }

    public openConsCardByVoice(args: any) {
        const consName = args.text.replace(/[.,!?]/g, "").trim();
        const consObj = getChildByName(this.world, consName);
        if (!consObj) return;

        this.currentObj = consObj;
        this.activateConstellation()
    }

    public rotateWorldToConsTarget(currentObj: SceneObject) {

        const worldTransform = this.world.getTransform();
        let objName = "";
        let baseRot; 

        if (currentObj.name === "s_label") {
            objName = currentObj.getChild(1).getComponent("Component.Text").text.toLowerCase()
            baseRot = starsMap.get(objName)!.rotation
        } else {
            objName = currentObj.name.replace(/[.,!?]/g, "").trim() 
            baseRot = consMap.get(objName)!.rotation;
        }
        const worldPos = this.world.getTransform().getWorldPosition();
        const targetPos = this.target.getTransform().getWorldPosition();
        this.currentObjPos = targetPos;
        const targetAngle = Math.atan2(worldPos.x - targetPos.x, worldPos.z - targetPos.z);
        const targetRot = quat.angleAxis(targetAngle, vec3.up());

        // by multiplying quaternions - getting the rotation
        const finalRot = targetRot.multiply(baseRot!);

        LSTween.rotateToLocal(
            worldTransform, 
            finalRot,
            1000
        )
        .easing(Easing.Quadratic.InOut)
        .start()
    }

    public rotateByController(rotation: quat) {
        this.currentObj?.getTransform().setLocalRotation(rotation)
    }

    public updateStarButtonList() {

        this.list.enabled = false;
        const le = this.gridLayout.getSceneObject().children.length
        for(let i = 0; i < le; i++)
            this.gridLayout.getSceneObject().getChild(i).enabled = false;

        ConstellationData.forEach((item) => {
            if(this.currentObj!.name === item.name) {
                const listLength = item.list_of_main_stars.length
                for(let i = 0; i < listLength; i++)
                {
                    const button = this.gridLayout.getSceneObject().getChild(i)
                    button.enabled = true;
                    button.getChild(0).getComponent("Component.Text").text = starsMap.get(item.list_of_main_stars[i])!.name
                }
                this.scrollWindow.scrollDimensions = new vec2(15, listLength * 5);
                this.scrollWindow.scrollPosition = new vec2(0, listLength * 5 / -2 )
                this.gridLayout.rows = listLength;
                this.gridLayout.layout()
            }
        })
    }

}


