import { linearDisCatalog, logarithDisCatalog, SCALE, C_SCALE, S_SCALE } from "./Config";
import { getChildByName, raDecToVec3, raDecToVec3Cons } from "./Utils";

export function createConstellation(
    item: any, 
    parent: SceneObject, 
    c_prefab: ObjectPrefab, 
    IS_LOGARITH: boolean
) {
    const cGroup = global.scene.createSceneObject('SceneObject')
    cGroup.setParent(parent);

    let distance: number | undefined;
    if(IS_LOGARITH) {
        distance = logarithDisCatalog.get(item.name)
    } else {
        distance = linearDisCatalog.get(item.name)
    }

    const cPos = raDecToVec3Cons(item, distance!, SCALE);
    cGroup.getTransform().setWorldPosition(cPos);
    cGroup.name = item.name;

    let c_Instance = c_prefab.instantiate(parent);
    c_Instance.getChild(0).getComponent('RenderMeshVisual').mainMaterial.mainPass.switcher = 0;
    c_Instance.getChild(1).getComponent('Text').text = item.name;

    c_Instance.setParent(cGroup);
    c_Instance.getTransform().setWorldScale(new vec3(C_SCALE, C_SCALE, C_SCALE))
}


export function createLine(parent: SceneObject, name: string, mat: Material, wiretool: any): void {

    const cGroup = getChildByName(parent, name);
    let length = cGroup!.getChildrenCount();
    const line = new wiretool.Create();
    line.radius = 0.1; 
    
    line.onPointsAdded.add(function(points: { position: vec3 }[]){ // whenever a point is added
        for(let i = 0; i < points.length; i++){ 
            //print('point added: ' + points[i].position.toString());
        }
    });

    for(let i = 0; i < length; i++) {
        const child = cGroup!.getChild(i);
        if (child.name === "s_label") {
            let pos = child.getTransform().getLocalPosition();
            line.addPoints(new vec3(pos.x, pos.y, pos.z))
        }
    }
   
    line.setMaterials(mat);
    line.getSceneObject().setParent(cGroup)
    cGroup!.enabled = true;
} 