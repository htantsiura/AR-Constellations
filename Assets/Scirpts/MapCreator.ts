import { raDecToVec3, getChildByName } from "./Utils";
import { ConstellationData } from "./Data/ConstellationData";
import { StarsData } from "./Data/StarsData";

//declare const require: (path: string) =&gt; any; 
//const WireTool = require("./WireTool"); 


/* 
const line = new WireTool.Create();

// callback example
line.onPointsAdded.add(function(points){ // whenever a point is added
    for(var i = 0; i < points.length; i++){ // for each new point
        print('point added: ' + points[i].position.toString()); // print the point's position


        // tip: this position is in local space.
        // that doesn't make a difference in this case, but when the line's SceneObject is transformed, you can convert local space positions to world space like so:
        //      line.localToWorld(points[i].position) → world space position
        
    }
});

// making a simple line
line.radius = 0.2; // thin line (1cm radius)
line.addPoints(new vec3(-10, 0, 0)); // 1st point at -10
line.addPoints(new vec3(10, 0, 0)); // 2nd point at 10
line.addPoints(new vec3(10, 10, 0)); // 2nd point at 10

// adding a material
line.setMaterials(script.lineMaterial);
*/

function createLine(parent: SceneObject, name: string, mat: Material, wiretool: any): void {

    const cGroup = getChildByName(parent, name);
    let length = cGroup!.getChildrenCount();
    print(length)
    const line = new wiretool.Create();
    line.radius = 0.1; 
    
    line.onPointsAdded.add(function(points: { position: vec3 }[]){ // whenever a point is added
        for(let i = 0; i < points.length; i++){ 
            print('point added: ' + points[i].position.toString());
        }
    });

    for(let i = 0; i < length; i++) {
        const child = cGroup!.getChild(i);
        if (child.name === "s_label") {
            let pos = child.getTransform().getLocalPosition();
            print(pos)
            line.addPoints(new vec3(pos.x, pos.y, pos.z))
        }
    }
   
    line.setMaterials(mat);
    line.getSceneObject().setParent(cGroup)
    cGroup!.enabled = true;
} 

@component
export class MapCreator extends BaseScriptComponent {

    @input
    universe!: SceneObject

    @input
    c_LabelPrefab!: ObjectPrefab

    @input
    s_LabelPrefab!: ObjectPrefab

    @input
    lineMaterial!: Material

    @input
    wireToolComponent!: ScriptComponent;

    private c_Scale: number = 3;
    private s_Scale: number = 2;

    onAwake() {
        if(!this.c_LabelPrefab || !this.universe) return;

        ConstellationData.forEach((item) => {
            const cGroup = global.scene.createSceneObject('SceneObject')
            cGroup.setParent(this.universe);

            const cPos = raDecToVec3(item, item.avg_distance, 1, true);
            cGroup.getTransform().setWorldPosition(cPos);
            cGroup.name = item.name;

            let c_Instance = this.c_LabelPrefab.instantiate(this.universe);
            c_Instance.getChild(0).getComponent('RenderMeshVisual').mainMaterial.mainPass.switcher = 0;
            c_Instance.getChild(1).getComponent('Text').text = item.name;

            c_Instance.setParent(cGroup);
            c_Instance.getTransform().setWorldScale(new vec3(this.c_Scale, this.c_Scale, this.c_Scale))
        })

        StarsData.forEach((item) => {
            const cGroup = getChildByName(this.universe, item.constellation)
            if (!cGroup) {
                print ("No constellation found");
                return;
            }
                
            const cPos = cGroup.getTransform().getWorldPosition();
            const sPos = raDecToVec3(item, item.distance_light_year, 1, true);
            const s_LocalPos = sPos.sub(cPos);
            
            let s_Instance = this.s_LabelPrefab.instantiate(this.universe);
            s_Instance.getChild(0).getComponent('RenderMeshVisual').mainMaterial.mainPass.switcher = 1;
            s_Instance.getChild(1).getComponent('Text').text = item.name;
            s_Instance.getChild(1).enabled = false;

            s_Instance.setParent(cGroup);
            s_Instance.getTransform().setLocalPosition(s_LocalPos);
            s_Instance.getTransform().setWorldScale(new vec3(this.s_Scale, this.s_Scale, this.s_Scale))
        })

        //creating a line
        createLine(this.universe, 'Orion', this.lineMaterial, this.wireToolComponent)


    }
}
