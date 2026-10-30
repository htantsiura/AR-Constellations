import { raDecToVec3, raDecToVec3Cons, getChildByName, mappingConstellationDistances } from "./Utils";
import { ConstellationData } from "./Data/ConstellationData";
import { StarsData } from "./Data/StarsData";
import { SCALE, IS_LOGARITH, C_SCALE, S_SCALE } from "./Config";
import { linearDisCatalog, logarithDisCatalog } from "./Config";
import { createConstellation, createStar, createLine } from "./Creators";

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

    onAwake() {
        if(!this.c_LabelPrefab || !this.universe) return;

        ConstellationData.forEach((item) => {
            createConstellation(item, this.universe, this.c_LabelPrefab, IS_LOGARITH)
        })

        StarsData.forEach((item) => {
            createStar(item, this.universe, this.s_LabelPrefab, IS_LOGARITH, S_SCALE, SCALE)
        })

        //creating a line
        createLine(this.universe, 'Orion', this.lineMaterial, this.wireToolComponent)
    }
}
