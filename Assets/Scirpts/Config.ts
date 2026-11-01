import { ConstellationData } from "./Data/ConstellationData";
import { StarsData } from "./Data/StarsData";
import { mappingConstellationDistances } from "./Utils";

export const SCALE: number = 1;
export const IS_LOGARITH: boolean = true;
export const C_SCALE: number = 3;
export const S_SCALE: number = 2;

// maps
export const linearDisCatalog = new Map<string, number>();
export const logarithDisCatalog = new Map<string, number>();
export const hipPositionCatalog = new Map<number, vec3>();

// colors
export const LINE_MODE: Record<string, number> = {
    "idle": 0.75,
    "active": 1.5,
    "pale": 0
}
export const C_COLORS: Record<string, vec4> = {
    "primary-50": new vec4(0.949, 0.898, 1.000, 1.0),  // #F2E5FF
    "primary-250": new vec4(0.749, 0.502, 1.000, 1.0), // #BF80FF
    "primary-400": new vec4(0.596, 0.200, 1.000, 1.0), // #9833FF
    "primary-500": new vec4(0.494, 0.000, 1.000, 1.0), // #7E00FF
    "primary-600": new vec4(0.396, 0.000, 0.800, 1.0), // #6500CC
    "primary-750": new vec4(0.247, 0.000, 0.502, 1.0), // #3F0080
    "primary-900": new vec4(0.098, 0.000, 0.200, 1.0), // #190033
    "primary-950": new vec4(0.051, 0.000, 0.102, 1.0)  // #0D001A
};

export const S_COLORS: Record<string, vec4> = {
    "secondary-50": new vec4(0.898, 0.980, 1.000, 1.0),  // #E5FAFF
    "secondary-250": new vec4(0.502, 0.898, 1.000, 1.0), // #80E5FF
    "secondary-400": new vec4(0.200, 0.839, 1.000, 1.0), // #33D6FF
    "secondary-500": new vec4(0.000, 0.800, 1.000, 1.0), // #00CCFF
    "secondary-600": new vec4(0.000, 0.639, 0.800, 1.0), // #00A3CC
    "secondary-750": new vec4(0.000, 0.400, 0.502, 1.0), // #006680
    "secondary-950": new vec4(0.000, 0.078, 0.102, 1.0)  // #00141A
};

@component
export class Config extends BaseScriptComponent {
    onAwake() {
    }
}