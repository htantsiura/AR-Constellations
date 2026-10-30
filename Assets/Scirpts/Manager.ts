@component
export class Manager extends BaseScriptComponent {

    @input
    cube!: SceneObject;
    
    onAwake() {
    }

    public toggleObject(obj: SceneObject) {
        if(!this.cube) return;
        this.cube.enabled = !this.cube.enabled
    }
}


