import { LSTween } from "LSTween.lspkg/LSTween"
import Easing from "LSTween.lspkg/TweenJS/Easing"

@component
export class MyTweenFuncs extends BaseScriptComponent {
    onAwake() {

    }
}

export function tweenMatValue(mat: Material, scriptName: string, a: number, b: number, time: number) {
    LSTween.shaderFloatPropertyFromTo(
        mat.mainPass, 
        scriptName,
        a,
        b,
        time
    )
    .repeat(0)
    .yoyo(false)
    .easing(Easing.Quadratic.Out)
    .start()
}

export function tweenObjectScale(transform: Transform, a: vec3, b: vec3, time: number) {
    LSTween.scaleFromToLocal(
        transform, 
        a,
        b,
        time
    )
    .repeat(0)
    .yoyo(false)
    .easing(Easing.Quadratic.Out)
    .start()
}

export function tweenObjectMove(transform: Transform, a: vec3, b: vec3, time: number) {
    LSTween.moveFromToLocal(
        transform, 
        a,
        b,
        time
    )
    .repeat(0)
    .yoyo(false)
    .easing(Easing.Quadratic.Out)
    .start()
}

export function tweenObjectMoveAndState(transform: Transform, a: vec3, b: vec3, time: number, state: boolean) {
    LSTween.moveFromToLocal(
        transform, 
        a,
        b,
        time
    )
    .repeat(0)
    .yoyo(false)
    .easing(Easing.Quadratic.Out)
    .start()
    .onComplete(() => {
        transform.getSceneObject().enabled = state;
    })
}

export function tweenObjectRotate(transform: Transform, a: quat, b: quat, time: number) {
    LSTween.rotateFromToLocal(
        transform, 
        a,
        b,
        time
    )
    .repeat(0)
    .yoyo(false)
    .easing(Easing.Quadratic.Out)
    .start()
}


