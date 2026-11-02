import { ConstellationData } from "./Data/ConstellationData";
import { StarsData } from "./Data/StarsData";
import { SCALE, IS_LOGARITH, C_SCALE, S_SCALE } from "./Config";
import { linearDisMap, logarithDisMap, hipPositionMap, consQuatMap } from "./Config";
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

    onAwake() {

        if(!this.c_LabelPrefab || !this.world) return;

        mappingConstellationDistances(
            ConstellationData,
            StarsData,
            linearDisMap,
            logarithDisMap
        )

        ConstellationData.forEach((item) => {
            const cPos = createConstellation(
                item, 
                this.world, 
                this.c_LabelPrefab, 
                IS_LOGARITH
            )
            const consQuat = quat.rotationFromTo(cPos, this.startVec3)
            consQuatMap.set(item.name, consQuat);
        })

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