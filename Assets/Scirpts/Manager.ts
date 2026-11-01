import Easing from "LSTween.lspkg/TweenJS/Easing";
import { CardContentUpdate } from "./Cards/CardContentUpdate";
import { turnOnAllStarsLabels, turnOffAllStarsLabels, setActiveLineMaterial, setDefaultLineMaterial } from "./VisibilitiModes";
import { LSTween } from "LSTween.lspkg/LSTween";
import { ToggleGroup } from "SpectaclesUIKit.lspkg/Scripts/Components/Toggle/ToggleGroup";
import { getChildByName } from "./Utils";

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
    deviceTracking!: DeviceTracking;

    @input
    godModeToggleGroup!: ToggleGroup;

    @input
    sun!: SceneObject;

    @input
    target!: SceneObject;

    @input
    world!: SceneObject;


    private isGodMode = false;
    public currentCons: SceneObject | null = null;
    public prevCons: SceneObject | null = null;
    
    onAwake() {
        this.card.enabled = false;
        this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.Rotation);
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });
    }

    private onStart(): void {

        this.godModeToggleGroup.onToggleSelected.add((args) => {
            this.handleGodModeChange(args);
        });
        this.rotateWorldToTarget();

        /* this.godModeToggleGroup.onToggleSelected.add((args) => {
            handleGodModeChange(args, this.deviceTracking, this.sun);
        }); */

        this.rotateWorldToTarget();
    }

    public handleGodModeChange(args: any) {
        let mode = "";

        if (args.toggleable) {
            const buttonObject = args.toggleable.getSceneObject();
            if (!buttonObject) return;
            mode = buttonObject.name;
        } else if (args.text) {
            mode = args.text
            print("voice control")
        } else {
            return;
        }
        
        if (mode === "God Mode.") {
            this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.World);
            this.sun.enabled = true;
        } else if (mode === "Sun Mode." || "Earth Mode.") {
            this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.Rotation);
            this.sun.enabled = false;
        }
    }

    public voiceGodModeChange(args: any) {
        this.handleGodModeChange(args)
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
        }
        turnOnAllStarsLabels(this.currentCons!) 
        setActiveLineMaterial(this.currentCons!, this.activeLineMat)
        this.openConsCard()
        this.prevCons = this.currentCons; 
    }

    /* public trackingMode_GOD() {
        if (this.isGodMode) return;
        this.isGodMode = true;
        this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.World);
    }

    public trackingMode_SUN() {
        if (!this.isGodMode) return;
        this.isGodMode = false;
        this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.Rotation);
    } */

    public rotateWorldToTarget() {

        const cons = getChildByName(this.world, "Gemini")
        if (!cons) return;


        const targetDir = this.target.getTransform().getWorldPosition().normalize();
        const consDir = cons.getTransform().getWorldPosition().normalize();

        const rotQuat = quat.rotationFromTo(consDir, targetDir);
        print(rotQuat)
        this.world.getTransform().setWorldRotation(rotQuat);


    }
}

/* export function handleGodModeChange(args: any, deviceTracking: DeviceTracking, sun: SceneObject) {
    let mode = "";

    if (args.toggleable) {
        const buttonObject = args.toggleable.getSceneObject();
        if (!buttonObject) return;
        mode = buttonObject.name;
    } else if (args.text) {
        mode = args.text
    } else {
        return;
    }
    
    if (mode === "God Mode") {
        deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.World);
        sun.enabled = true;
    } else if (mode === "Sun Mode" || "Earth Mode") {
        deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.Rotation);
        sun.enabled = false;
    }
} */


