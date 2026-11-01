import Easing from "LSTween.lspkg/TweenJS/Easing";
import { CardContentUpdate } from "./Cards/CardContentUpdate";
import { turnOnAllStarsLabels, turnOffAllStarsLabels, setActiveLineMaterial, setDefaultLineMaterial } from "./VisibilitiModes";
import { LSTween } from "LSTween.lspkg/LSTween";
import { ToggleGroup } from "SpectaclesUIKit.lspkg/Scripts/Components/Toggle/ToggleGroup";

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

    private isGodMode = false;
    public currentCons: SceneObject | null = null;
    public prevCons: SceneObject | null = null;
    
    onAwake() {
       // this.card.enabled = false;
        print("A W A K E")
        this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.Rotation);
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });
    }

    private onStart(): void {
        this.godModeToggleGroup.onToggleSelected.add((args) => {
            this.handleGodModeChange(args);
        });
    }

    private handleGodModeChange(args: any) {
        if (!args || !args.toggleable) return;

        const buttonObject = args.toggleable.getSceneObject();
        if (!buttonObject) return;

        const mode = buttonObject.name;
        if (mode === "GOD") {
            this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.World);
        } else {
            this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.Rotation);
        }
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

    public trackingMode_GOD() {
        if (this.isGodMode) return;
        this.isGodMode = true;
        this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.World);
    }

    public trackingMode_SUN() {
        if (!this.isGodMode) return;
        this.isGodMode = false;
        this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.Rotation);
    }
}


