import { LSTween } from "LSTween.lspkg/LSTween";
import { ToggleGroup } from "SpectaclesUIKit.lspkg/Scripts/Components/Toggle/ToggleGroup";

@component
export class ModeSwitcher extends BaseScriptComponent {
    private asrModule = require("LensStudio:AsrModule");

    @input
    deviceTracking!: DeviceTracking;

    @input
    godModeToggleGroup!: ToggleGroup;

    @input
    sun!: SceneObject;

    @input
    displayText!: Text;

    @input
    kit!: SceneObject;

    private isGodMode: boolean = false;

    onAwake(): void {
        this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.Rotation);
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });
    }

    onStart() {
        if (!this.displayText) return;

        const options = AsrModule.AsrTranscriptionOptions.create(); 
        options.silenceUntilTerminationMs = 1000; 
        options.mode = AsrModule.AsrMode.HighAccuracy; 

        options.onTranscriptionUpdateEvent.add((eventArgs) => {
            this.onTranscriptionUpdate(eventArgs);
        });

        options.onTranscriptionErrorEvent.add((eventArgs) => {
            this.onTranscriptionError(eventArgs);
        });

        // run voice recognizer
        this.asrModule.startTranscribing(options);

        // toggle by buttons
        this.godModeToggleGroup.onToggleSelected.add((args) => {
            this.handleGodModeChange(args);
        });
    }

    private onTranscriptionUpdate(eventArgs: AsrModule.TranscriptionUpdateEvent): void { 
        this.displayText.text = eventArgs.text;

        if (eventArgs.isFinal) {
            LSTween.colorTextTo(this.displayText, new vec4(0, 1, 0, 1), 300).start();
        } else {
            LSTween.colorTextTo(this.displayText, new vec4(1, 1, 1, 1), 100).start(); 
        }
        this.handleGodModeChange(eventArgs)
    }

    private onTranscriptionError(errorCode: AsrModule.AsrStatusCode): void {
        print(`Ошибка ASR: ${errorCode}`);
    }

    public handleGodModeChange(args: any) {
        let mode = "";

        if (args.toggleable) {
            const buttonObject = args.toggleable.getSceneObject();
            if (!buttonObject) return;
            mode = buttonObject.name;
        } else if (args.text) {
            mode = args.text.replace(/[.,!?]/g, "").trim().toLowerCase();
            print("voice control")
        } else {
            return;
        }
      
        if (mode === "god mode" || mode === "godmode" || mode === "godmod") {
            if (!this.isGodMode) {
                this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.World);
                this.sun.enabled = true;

                this.kit.enabled = false;
                this.kit.enabled = true;
                
                this.isGodMode = true;
            }
        } else if (mode === "sun mode" || mode === "sunmode" || mode === "san mode" || mode === "earth mode") {
            if (this.isGodMode) {
                this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.Rotation);
                this.sun.enabled = false;

                this.kit.enabled = false;
                this.kit.enabled = true;

                this.isGodMode = false;
            }
        }
    }
}