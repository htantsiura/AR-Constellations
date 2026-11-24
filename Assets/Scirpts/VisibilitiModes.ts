import { LSTween } from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"
import { LINE_MODE, STAR_MODE, TW_TIME, S_SCALE } from "./Config"
import { tweenObjectScale } from "./ControllerBtn"


@component

export class VisibilityModes extends BaseScriptComponent {
    onAwake() {
    }
}

export function consIdleToActiveVisibility(object: SceneObject, matStar: Material, matLine: Material) {
    object.children.forEach((item) => {
        if(item.name === "s_label") {
            item.getChild(1).enabled = true
            item.getChild(1).getComponent("Component.Text").renderOrder = 2;
            item.getChild(0).getComponent("Component.RenderMeshVisual").mainMaterial = matStar;
            item.getChild(0).getComponent("Component.RenderMeshVisual").renderOrder = 2;
        }
        if(item.name === "Wire") {
            item.getComponent("Component.RenderMeshVisual").mainMaterial = matLine;
            item.getComponent("Component.RenderMeshVisual").renderOrder = 2;
        }
    })
    animateMatParameter(matLine.mainPass, "slider", LINE_MODE.idle, LINE_MODE.active, TW_TIME)
}

export function consActiveToIdleVisibility(object: SceneObject, matStar: Material, matLine: Material) {
    object.children.forEach((item) => {
        if(item.name === "s_label") {
            item.getChild(1).enabled = false
            item.getChild(1).getComponent("Component.Text").renderOrder = 0;
            item.getChild(0).getComponent("Component.RenderMeshVisual").mainMaterial = matStar;
            item.getChild(0).getComponent("Component.RenderMeshVisual").renderOrder = 0;
        }
        if(item.name === "Wire") {
            item.getComponent("Component.RenderMeshVisual").mainMaterial = matLine;
            item.getComponent("Component.RenderMeshVisual").renderOrder = 0;
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

export function starIdleToActiveVisibility(object: SceneObject, matStar: Material) {

    object.getChild(1).enabled = true;
    object.getChild(0).getComponent("Component.RenderMeshVisual").mainMaterial = matStar;
    animateMatParameter(matStar.mainPass, "slider", STAR_MODE.idle, STAR_MODE.active, TW_TIME)
    /* const sizeA = new vec3(1, 1, 1)
    const sizeB = new vec3(1.5, 1.5, 1.5)
    tweenObjectScale(object.getChild(0).getTransform(), sizeA, sizeB, TW_TIME) */
}

export function starActiveToIdleVisibility(object: SceneObject, matStar: Material) {

    object.getChild(1).enabled = false;
    object.getChild(0).getComponent("Component.RenderMeshVisual").mainMaterial = matStar;
/*     object.getChild(0).getTransform().setLocalScale(new vec3(1, 1, 1));
 */}

export function starActiveToSelectedVisibility(object: SceneObject, matStar: Material) {

    object.getChild(1).enabled = true;
    object.getChild(0).getComponent("Component.RenderMeshVisual").mainMaterial = matStar;
    animateMatParameter(matStar.mainPass, "slider", STAR_MODE.idle, STAR_MODE.active, TW_TIME)
    /* const sizeA = new vec3(1, 1, 1)
    const sizeB = new vec3(1.5, 1.5, 1.5)
    tweenObjectScale(object.getChild(0).getTransform(), sizeA, sizeB, TW_TIME) */
}

export function starSelectedToActiveVisibility(object: SceneObject, matStar: Material) {

    object.getChild(1).enabled = false;
    object.getChild(0).getComponent("Component.RenderMeshVisual").mainMaterial = matStar;
/*     object.getChild(0).getTransform().setLocalScale(new vec3(1, 1, 1));
 */}