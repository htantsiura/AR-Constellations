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

    private isGodMode: boolean = false;

    onAwake(): void {

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

        this.godModeToggleGroup.onToggleSelected.add((args) => {
            this.handleGodModeChange(args);
        });
    }

    private onTranscriptionUpdate(eventArgs: AsrModule.TranscriptionUpdateEvent): void { 
        this.displayText.text = eventArgs.text;

        if (eventArgs.isFinal) {
            LSTween.colorTextTo(this.displayText, new vec4(0, 1, 0, 1), 300).start(); [7]
        } else {
            LSTween.colorTextTo(this.displayText, new vec4(1, 1, 1, 1), 100).start(); [7]
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
            mode = args.text
            print("voice control")
        } else {
            return;
        }
        
        if (mode === "God Mode." || mode === "God mode." || mode === "Godmode.") {
            if (!this.isGodMode) {
                this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.World);
                this.sun.enabled = true;
                this.isGodMode = true;
            }
        } else if (mode === "Sun Mode." || mode === "Sun mode." || mode === "Sanmode." || mode === "Earth Mode.") {
            if (this.isGodMode) {
                this.deviceTracking.requestDeviceTrackingMode(DeviceTrackingMode.Rotation);
                this.sun.enabled = false;
                this.isGodMode = false;
            }
        }
    }
}