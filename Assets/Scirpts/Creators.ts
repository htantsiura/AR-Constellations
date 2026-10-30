import { linearDisCatalog, logarithDisCatalog, SCALE, C_SCALE, S_SCALE, hipPositionCatalog } from "./Config";
import { getChildByName, raDecToVec3, raDecToVec3Cons, remap } from "./Utils";
import { CapsuleButton } from "SpectaclesUIKit.lspkg/Scripts/Components/Button/CapsuleButton";

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
    const x = remap(item.name.length, 5, 19, 5, 14.5 )
    const buttonComp = c_Instance.getChild(2).getComponent('Component.ScriptComponent') as CapsuleButton
    buttonComp.size = new vec3(x, 1.7, 1) 


    c_Instance.setParent(cGroup);
    c_Instance.getTransform().setWorldScale(new vec3(C_SCALE, C_SCALE, C_SCALE))
}

export function createStar(
    item: any, 
    parent: SceneObject, 
    s_LabelPrefab: ObjectPrefab, 
    IS_LOGARITH: boolean,
    S_SCALE: number,
    SCALE: number,
    catalog: Map<number, vec3>
): void {
    const cGroup = getChildByName(parent, item.constellation)
    if (!cGroup) {
        print ("No constellation found");
        return;
    }
    const cPos = cGroup.getTransform().getWorldPosition();
    const sPos = raDecToVec3(item, item.distance_light_year, SCALE, IS_LOGARITH);
    catalog.set(item.hip, sPos);
    const s_LocalPos = sPos.sub(cPos);
    
    let s_Instance = s_LabelPrefab.instantiate(parent);
    s_Instance.getChild(0).getComponent('RenderMeshVisual').mainMaterial.mainPass.switcher = 1;
    s_Instance.getChild(1).getComponent('Text').text = item.name;
    s_Instance.getChild(1).enabled = false;

    s_Instance.setParent(cGroup);
    s_Instance.getTransform().setLocalPosition(s_LocalPos);
    s_Instance.getTransform().setWorldScale(new vec3(S_SCALE, S_SCALE, S_SCALE))

    //catalog.set(item.hip, s_LocalPos);
}

export function createLine(
    item: any, 
    parent: SceneObject, 
    mat: Material, 
    wiretool: any
): void {

    const cGroup = getChildByName(parent, item.common_name.native);
    if (!cGroup) return; 
    
    const groupPos = cGroup.getTransform().getWorldPosition()

    item.lines?.forEach((segment: number[]) => {
        const line = new wiretool.Create();
        line.name = "line";
        line.radius = 0.1; 
        
        line.onPointsAdded.add(function(points: { position: vec3 }[]){ // whenever a point is added
            for(let i = 0; i < points.length; i++){ 
                //print('point added: ' + points[i].position.toString());
            }
        });

        segment.forEach((star: number) => {
            const pos = hipPositionCatalog.get(star)?.sub(groupPos)
            if(pos)
                line.addPoints(pos)
            else
                print("Star " + star + " not found")
        })
        line.setMaterials(mat);
        line.getSceneObject().setParent(cGroup)
    })
    cGroup!.enabled = true;
} 