import { LSTween } from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"
import { LINE_MODE, TW_TIME } from "./Config"


@component

export class VisibilityModes extends BaseScriptComponent {
    onAwake() {
    }
}

export function consIdleToActiveVisibility(object: SceneObject, matStar: Material, matLine: Material) {
    object.children.forEach((item) => {
        if(item.name === "s_label") {
            item.getChild(1).enabled = true
            item.getChild(0).getComponent("Component.RenderMeshVisual").mainMaterial = matStar;
        }
        if(item.name === "Wire") {
            item.getComponent("Component.RenderMeshVisual").mainMaterial = matLine;
        }
    })
    animateMatParameter(matLine.mainPass, "slider", LINE_MODE.idle, LINE_MODE.active, TW_TIME)
}

export function consActiveToIdleVisibility(object: SceneObject, matStar: Material, matLine: Material) {
    object.children.forEach((item) => {
        if(item.name === "s_label") {
            item.getChild(1).enabled = false
            item.getChild(0).getComponent("Component.RenderMeshVisual").mainMaterial = matStar;
        }
        if(item.name === "Wire") {
            item.getComponent("Component.RenderMeshVisual").mainMaterial = matLine;
        }
    })
}

export function changeMatSlider(mat: Material, a: number, b: number) {
    animateMatParameter(mat.mainPass, "slider", a, b, TW_TIME)
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

/* export function turnOnAllStarsLabels(object: SceneObject, mat: Material) {
    object.children.forEach((item) => {
        if(item.name === "s_label") {
            item.getChild(1).enabled = true
            item.getChild(0).getComponent("Component.RenderMeshVisual").mainMaterial = mat;
        }
    })
} */

/* export function turnOffAllStarsLabels(object: SceneObject, mat: Material) {
    object.children.forEach((item) => {
        if(item.name === "s_label") {
            item.getChild(1).enabled = false
            item.getChild(0).getComponent("Component.RenderMeshVisual").mainMaterial = mat;

        }
    })
} */

/* export function setActiveStarMaterial(object: SceneObject, mat: Material) {
    object.children.forEach((item) => {
        if(item.name === "s_label") {
            item.getComponent("Component.RenderMeshVisual").mainMaterial = mat;
        }
    })
    animateMatParameter(mat.mainPass, "slider", LINE_MODE.idle, LINE_MODE.active, 250)
} */

/* export function setActiveLineMaterial(object: SceneObject, mat: Material) {
    object.children.forEach((item) => {
        if(item.name === "Wire") {
            item.getComponent("Component.RenderMeshVisual").mainMaterial = mat;
        }
    })
    animateMatParameter(mat.mainPass, "slider", LINE_MODE.idle, LINE_MODE.active, 250)
} */

/* export function setPaleLineMaterial(object: SceneObject, mat: Material) {
    object.children.forEach((item) => {
        if(item.name === "Wire") {
            item.getComponent("Component.RenderMeshVisual").mainMaterial = mat;
        }
    })
    animateMatParameter(mat.mainPass, "slider", LINE_MODE.idle, LINE_MODE.pale, 250)
} */

/* export function setDefaultLineMaterial(object: SceneObject, mat: Material) {
    object.children.forEach((item) => {
        if(item.name === "Wire") {
            item.getComponent("Component.RenderMeshVisual").mainMaterial = mat;
        }
    })
} */

/* export function turnOnOffControllerBtn(object: SceneObject, value: boolean) {
    print(" )))))))")
    object.getChild(0).getChild(4).enabled = value;
} */


