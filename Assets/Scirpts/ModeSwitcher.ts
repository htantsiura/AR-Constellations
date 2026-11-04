import { LSTween } from "LSTween.lspkg/LSTween";
import { ToggleGroup } from "SpectaclesUIKit.lspkg/Scripts/Components/Toggle/ToggleGroup";
import { Manager } from "./Manager";
import { C_COLORS, S_COLORS } from "./Config";

@component
export class ModeSwitcher extends BaseScriptComponent {
    private asrModule = require("LensStudio:AsrModule");

    @input godModeToggleGroup!: ToggleGroup;
    @input appManager!: Manager;
    @input camera!: SceneObject;
    @input world!: SceneObject;
    @input sun!: SceneObject;
    @input displayText!: Text;
    

    private isGodMode: boolean = false;
    private _godModeFlag: boolean = false;
    
    private updateEvent!: UpdateEvent;
    private delayEvent!: DelayedCallbackEvent;
    
    onAwake(): void {
        this.updateEvent = this.createEvent("UpdateEvent");
        this.updateEvent.enabled = false; 

        this.updateEvent.bind(() => {
            if (!this.isGodMode) {
                const camPos = this.camera.getTransform().getWorldPosition();
                this.world.getTransform().setWorldPosition(camPos);
            } else if (this.isGodMode && !this._godModeFlag) {
                const camPos = this.camera.getTransform().getWorldPosition();
                this.world.getTransform().setWorldPosition(camPos);
                this._godModeFlag = true;
            }
        });

        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });

        this.delayEvent = this.createEvent("DelayedCallbackEvent")
        this.delayEvent.bind(() => {
            this.displayText.enabled = false;
        })
        
    }

    onStart() {
        if (!this.displayText) return;

        const options = AsrModule.AsrTranscriptionOptions.create(); 
        options.silenceUntilTerminationMs = 1000; 
        options.mode = AsrModule.AsrMode.HighAccuracy; 

        options.onTranscriptionUpdateEvent.add((eventArgs) => {
            this.displayText.enabled = true;
            this.onTranscriptionUpdate(eventArgs);
        });

        options.onTranscriptionErrorEvent.add((eventArgs) => {
            this.onTranscriptionError(eventArgs);
        });

        this.asrModule.startTranscribing(options);

        this.godModeToggleGroup.onToggleSelected.add((args) => {
            this.handleGodModeChange(args);
        });

        this.updateEvent.enabled = true;
    }

    private onTranscriptionUpdate(eventArgs: AsrModule.TranscriptionUpdateEvent): void { 
        this.displayText.text = eventArgs.text;

        if (eventArgs.isFinal) {

            this.displayText.textFill.color = C_COLORS["primary-500"];
            
            this.appManager.openConsCardByVoice(eventArgs);
            this.handleGodModeChange(eventArgs);
        } else {
            this.displayText.textFill.color = S_COLORS["secondary-500"];
        }
        this.delayEvent.reset(2);
    }

    private onTranscriptionError(errorCode: AsrModule.AsrStatusCode): void {
        print(`Error ASR: ${errorCode}`);
    }

    public handleGodModeChange(args: any) {
        let mode = "";

        if (args.toggleable) {
            const buttonObject = args.toggleable.getSceneObject();
            if (!buttonObject) return;
            mode = buttonObject.name;
        } else if (args.text) {
            mode = args.text.replace(/[.,!?]/g, "").trim().toLowerCase();
            print("voice control: " + mode);
        } else {
            return;
        }
      
        if (mode.includes("god mode") || mode.includes("godmode") || mode.includes("godmod")) {
            if (!this.isGodMode) {
                this.sun.enabled = true;
                this.isGodMode = true;
                this._godModeFlag = false;
            }
        } else if (mode.includes("sun mode") || mode.includes("sunmode") || mode.includes("san mode") || mode.includes("earth mode")) {
            if (this.isGodMode) {
                this.sun.enabled = false;
                this.isGodMode = false;
            }
        }
    }
}

/* import { LSTween } from "LSTween.lspkg/LSTween";
import { ToggleGroup } from "SpectaclesUIKit.lspkg/Scripts/Components/Toggle/ToggleGroup";
import { Manager } from "./Manager";

@component
export class ModeSwitcher extends BaseScriptComponent {
    private asrModule = require("LensStudio:AsrModule");

    @input
    godModeToggleGroup!: ToggleGroup;

     @input
    camera!: SceneObject;

    @input
    world!: SceneObject;

    @input
    sun!: SceneObject;

    @input
    displayText!: Text;

    @input
    appManager!: Manager;

    @input
    debugText!: Text;

    private isGodMode: boolean = false;
    private _godModeFlag: boolean = false;

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart();
        });
    }

    onStart() {
        if (!this.displayText) return;

        

        const options = AsrModule.AsrTranscriptionOptions.create(); 
        options.silenceUntilTerminationMs = 1000; 
        //

        options.onTranscriptionUpdateEvent.add((eventArgs) => {
            this.debugText.text = "onTranscriptionUpdateEvent"
            this.onTranscriptionUpdate(eventArgs);
            this.appManager.openConsCardByVoice(eventArgs);
        });

        options.onTranscriptionErrorEvent.add((eventArgs) => {
            this.debugText.text = "ASR ERROR: " + eventArgs;
            this.onTranscriptionError(eventArgs);
        });

        // run voice recognizer
        this.asrModule.startTranscribing(options);

        // toggle by buttons
        this.godModeToggleGroup.onToggleSelected.add((args) => {
            this.handleGodModeChange(args);
        });

        const update = this.createEvent("UpdateEvent")
        update.bind(() => {
            if (!this.isGodMode) {
                const camPos = this.camera.getTransform().getWorldPosition();
                this.world.getTransform().setWorldPosition(camPos)
            }
            if (this.isGodMode && !this._godModeFlag) {
                const camPos = this.camera.getTransform().getWorldPosition();
                this.world.getTransform().setWorldPosition(camPos)
                this._godModeFlag = true;
            }
        })
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
        print(`Error ASR: ${errorCode}`);
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
                this.sun.enabled = true;
                this.isGodMode = true;
                this._godModeFlag = false;
            }
        } else if (mode === "sun mode" || mode === "sunmode" || mode === "san mode" || mode === "earth mode") {
            if (this.isGodMode) {
                this.sun.enabled = false;
                this.isGodMode = false;
            }
        }
    }
} */