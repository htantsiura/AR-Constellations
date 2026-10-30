//Utils

export function raDecToVec3( 
    item: any, 
    distance: number,
    scale: number, 
    isLogariph: boolean
): vec3 {

    if (!item) return vec3.zero();

    let finalDistance: number;
    const defaultRadius = 250;
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

export function raDecToVec3Cons( 
    item: any, 
    distance: number,
    scale: number, 
): vec3 {

    if (!item) return vec3.zero();

    let finalDistance: number;
    const defaultRadius = 250;
    finalDistance = (distance ?? defaultRadius) * scale

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

export function mappingConstellationDistances(
    ConstellationData: any,
    StarsData: any,
    linearDisCatalog: Map<string, number>,
    logarithDisCatalog: Map<string, number>
) {
    ConstellationData.forEach((con: any) => {
        let minDis: number = 0;
        let maxDis: number = 0;
        let distances: number[] = []

        StarsData.forEach((star: any) => {
            if (star.constellation === con.name) {
                distances.push(star.distance_light_year);
            }
        })

        const length = distances.length
        minDis = distances[0]
        maxDis = distances[0]
        for (let i = 1; i < length; i++) {
            if(minDis > distances[i])
                minDis = distances[i]
            if(maxDis < distances[i])
                maxDis = distances[i]
        }
        const avgLinearDistance = (maxDis + minDis) / 2;
        minDis = Math.log10(minDis) * 99 + 1;
        maxDis = Math.log10(maxDis) * 99 + 1;
        const avgLogarithDistance = (maxDis + minDis) / 2;

        linearDisCatalog.set(con.name, avgLinearDistance);
        logarithDisCatalog.set(con.name, avgLogarithDistance)
    })
}

export function mappingHipPosition(
    item: any,
    localPos: vec3,
    hipPositionCatalog: Map<number, vec3>
) {
    hipPositionCatalog.set(item.hip, localPos);
}

export function remap(
    value: number, 
    inMin: number, 
    inMax: number, 
    outMin: number, 
    outMax: number
): number | 0 {
    if (inMin === inMax) return outMin; 
    return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin)
}
