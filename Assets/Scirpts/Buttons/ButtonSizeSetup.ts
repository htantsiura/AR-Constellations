import { RectangleButton } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/RectangleButton";
import { remap } from "Scirpts/Utils";

@component
export class ButtonSizeSetup extends BaseScriptComponent {

    @input
    myButton!: RectangleButton;

    public setupButtonSize(name: string) {
        if (!this.myButton) return;

    const x = remap(name.length, 5, 19, 5, 14.5 )
    this.myButton.size = new vec3(x, 1.7, 1) 
    }
}
