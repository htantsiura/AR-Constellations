import { raDecToVec3, raDecToVec3Cons, getChildByName, mappingConstellationDistances } from "./Utils";
import { ConstellationData } from "./Data/ConstellationData";
import { StarsData } from "./Data/StarsData";
import { SCALE, IS_LOGARITH, C_SCALE, S_SCALE } from "./Config";
import { linearDisCatalog, logarithDisCatalog } from "./Config";
import { createConstellation, createLine } from "./Creators";

@component
export class MapCreator extends BaseScriptComponent {

    @input universe!: SceneObject

    @input c_LabelPrefab!: ObjectPrefab

    @input s_LabelPrefab!: ObjectPrefab

    @input lineMaterial!: Material

    @input wireToolComponent!: ScriptComponent;

    onAwake() {
        if(!this.c_LabelPrefab || !this.universe) return;

        mappingConstellationDistances(
            ConstellationData,
            StarsData,
            linearDisCatalog,
            logarithDisCatalog
        )

        ConstellationData.forEach((item) => {
            createConstellation(item, this.universe, this.c_LabelPrefab, IS_LOGARITH)
        })

        StarsData.forEach((item) => {
            const cGroup = getChildByName(this.universe, item.constellation)
            if (!cGroup) {
                print ("No constellation found");
                return;
            }
            const cPos = cGroup.getTransform().getWorldPosition();
            const sPos = raDecToVec3(item, item.distance_light_year, SCALE, IS_LOGARITH);
            const s_LocalPos = sPos.sub(cPos);
            
            let s_Instance = this.s_LabelPrefab.instantiate(this.universe);
            s_Instance.getChild(0).getComponent('RenderMeshVisual').mainMaterial.mainPass.switcher = 1;
            s_Instance.getChild(1).getComponent('Text').text = item.name;
            s_Instance.getChild(1).enabled = false;

            s_Instance.setParent(cGroup);
            s_Instance.getTransform().setLocalPosition(s_LocalPos);
            s_Instance.getTransform().setWorldScale(new vec3(S_SCALE, S_SCALE, S_SCALE))
        })

        //creating a line
        createLine(this.universe, 'Orion', this.lineMaterial, this.wireToolComponent)


    }
}
