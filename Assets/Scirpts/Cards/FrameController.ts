import { Frame } from "SpectaclesUIKit.lspkg/Scripts/Components/Frame/Frame";

@component
export class FrameController extends BaseScriptComponent {
   
    @input
    myFrame!: Frame;

    onAwake() {
    }

    onStart() {
        if (!this.myFrame) return;

        // Изменяем прозрачность фрейма на 50%
        this.myFrame.opacity = 1; 
        
        // Если нужно прочитать текущее значение:
        // print("Текущая прозрачность: " + this.myFrame.opacity);
    }

    
}

