import { ConstellationData } from "./Data/ConstellationData";
import { StarsData } from "./Data/StarsData";
import { mappingConstellationDistances } from "./Utils";

export const SCALE: number = 1;
export const IS_LOGARITH: boolean = true;
export const C_SCALE: number = 3;
export const S_SCALE: number = 2;

export const linearDisCatalog = new Map<string, number>();
export const logarithDisCatalog = new Map<string, number>();

@component
export class Config extends BaseScriptComponent {


    onAwake() {

        mappingConstellationDistances(
            ConstellationData,
            StarsData,
            linearDisCatalog,
            logarithDisCatalog
        )

    }
}