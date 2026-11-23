import { ConstellationData } from "./Data/ConstellationData";
import { StarsData } from "./Data/StarsData";
import { SCALE, IS_LOGARITH, C_SCALE, S_SCALE } from "./Config";
import { linearDisMap, logarithDisMap, hipPositionMap, ZERO_ROT } from "./Config";
import { createConstellation, createStar, createLine } from "./Creators";
import { LinesData } from "./Data/LinesData_SnT";
import { mappingConstellationDistances } from "./Utils";

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

    private startVec3 = new vec3(0, 0, -1)
    private i: number = 0;
    private max: number = 0;

    onAwake() {

        if(!this.c_LabelPrefab || !this.world) return;

        mappingConstellationDistances(
            ConstellationData,
            StarsData,
            linearDisMap,
            logarithDisMap
        )

        ConstellationData.forEach((item) => {
            createConstellation(
                item, 
                this.world, 
                this.c_LabelPrefab, 
                IS_LOGARITH
            )
            /* if (this.max < item.list_of_main_stars.length)
                this.max = item.list_of_main_stars.length */
        })

        print ("max " + this.max)

        StarsData.forEach((item) => {
            createStar(
                item, 
                this.world, 
                this.s_LabelPrefab, 
                IS_LOGARITH, 
                S_SCALE, 
                SCALE, 
                hipPositionMap
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