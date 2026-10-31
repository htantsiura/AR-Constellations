import { remap } from "./../Utils";
import { CapsuleButton } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/CapsuleButton";
@component
export class ButtonSize extends BaseScriptComponent {

    @input
    button!: CapsuleButton;

    /* onAwake() {
        const parent = this.getSceneObject().getParent()
        const length = parent.name.length
        const x = remap(length, 5, 19, 5, 14.5 )
        this.button.size = new vec3(x, 1.7, 1) 
        //this.button.style = new vec3(x, 1.7, 1) 
        //const buttonComp = getChildByName(parent, "button")?.getComponent("Component.ScriptComponent") as CapsuleButton
        //buttonComp.size = new vec3(9, 1, 1);
        //print(name + "____")
    } */
    onStart() {
        const parent = this.getSceneObject().getParent()
        if (parent) {
            print ("ok")
        } else {
            print ("nothing")
        }
        const length = parent.name.length
        const x = remap(length, 5, 19, 5, 14.5 )
        this.button.size = new vec3(x, 1.7, 1) 
        print(parent.name + " " + length + " " + x)
        //this.button.style = new vec3(x, 1.7, 1) 
        //const buttonComp = getChildByName(parent, "button")?.getComponent("Component.ScriptComponent") as CapsuleButton
        //buttonComp.size = new vec3(9, 1, 1);
        //print(name + "____")
    }
}
