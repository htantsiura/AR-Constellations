//Utils

export function raDecToVec3( 
    item: any, 
    distance: number,
    scale: number, 
    isLogariph: boolean
): vec3 {

    if (!item) return vec3.zero();

    let finalDistance: number;
    const defaultRadius = 500;
    const safeDistance = distance ?? defaultRadius

    if(isLogariph) {
        finalDistance = (Math.log10(safeDistance) * 99 + 1) * scale;
    } else {
        finalDistance = safeDistance * scale;
    }

    const raRad = item.right_ascension * (Math.PI / 12);
    const decRad = item.declination * (Math.PI / 180)

    const x = finalDistance * Math.cos(decRad) * Math.cos(raRad);
    const y = finalDistance * Math.sin(decRad);
    const z = -1 * finalDistance * Math.cos(decRad) * Math.sin(raRad);

    return new vec3(x, y, z);
}

export function getChildByName(
    parent: SceneObject, 
    nameToFind: string
): SceneObject | null {

    const length = parent.getChildrenCount();

    for (let i = 0; i < length; i++) {
        const child = parent.getChild(i);
        if (child.name === nameToFind)
            return child;
    }
    return null;
}
