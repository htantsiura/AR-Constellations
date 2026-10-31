import { ConstellationData } from "./Data/ConstellationData";
import { StarsData } from "./Data/StarsData";
import { SCALE, IS_LOGARITH, C_SCALE, S_SCALE } from "./Config";
import { linearDisCatalog, logarithDisCatalog, hipPositionCatalog } from "./Config";
import { createConstellation, createStar, createLine } from "./Creators";
import { LinesData } from "./Data/LinesData_SnT";

@component
export class WorldCreator extends BaseScriptComponent {

    @input 
    world!: SceneObject

    @input 
    c_LabelPrefab!: ObjectPrefab

    @input 
    s_LabelPrefab!: ObjectPrefab

    @input 
    lineMaterial!: Material

    @input 
    wireToolComponent!: ScriptComponent;

    onAwake() {
        if(!this.c_LabelPrefab || !this.world) return;

        ConstellationData.forEach((item) => {
            createConstellation(
                item, 
                this.world, 
                this.c_LabelPrefab, 
                IS_LOGARITH
            )
        })

        StarsData.forEach((item) => {
            createStar(
                item, 
                this.world, 
                this.s_LabelPrefab, 
                IS_LOGARITH, 
                S_SCALE, 
                SCALE, 
                hipPositionCatalog
            )
        })

        LinesData.forEach((item) => {
            createLine(
                item, 
                this.world, 
                this.lineMaterial, 
                this.wireToolComponent
            )
        })
    }
}
