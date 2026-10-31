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
}

export function setDefaultLineMaterial(object: SceneObject, mat: Material) {
    object.children.forEach((item) => {
        if(item.name === "Wire") {
            item.getComponent("Component.RenderMeshVisual").mainMaterial = mat;
        }
    })
}