import { LSTween } from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"
import { LINE_MODE } from "./Config"


@component

export class VisibilityModes extends BaseScriptComponent {
    onAwake() {
    }
}

export function turnOnAllStarsLabels(object: SceneObject) {
    object.children.forEach((item) => {
        if(item.name === "s_label") {
            item.getChild(1).enabled = true
        }
    })
}

export function turnOffAllStarsLabels(object: SceneObject) {
    object.children.forEach((item) => {
        if(item.name === "s_label") {
            item.getChild(1).enabled = false
        }
    })
}

export function setActiveLineMaterial(object: SceneObject, mat: Material) {
    object.children.forEach((item) => {
        if(item.name === "Wire") {
            item.getComponent("Component.RenderMeshVisual").mainMaterial = mat;
        }
    })
    animateMatParameter(mat.mainPass, "slider", LINE_MODE.idle, LINE_MODE.active, 250)
}

export function setPaleLineMaterial(object: SceneObject, mat: Material) {
    object.children.forEach((item) => {
        if(item.name === "Wire") {
            item.getComponent("Component.RenderMeshVisual").mainMaterial = mat;
        }
    })
    animateMatParameter(mat.mainPass, "slider", LINE_MODE.default, LINE_MODE.pale, 250)
}

export function setDefaultLineMaterial(object: SceneObject, mat: Material) {
    object.children.forEach((item) => {
        if(item.name === "Wire") {
            item.getComponent("Component.RenderMeshVisual").mainMaterial = mat;
        }
    })
}

export function animateMatParameter(
    matPass: any, 
    scriptName: string, 
    a: number, 
    b: number, 
    t: number
) {
    LSTween.shaderFloatPropertyFromTo(
        matPass,
        scriptName,
        a,
        b,
        t
    )
    .easing(Easing.Quadratic.Out)
    .repeat(0)
    .yoyo(false)
    .start()
}