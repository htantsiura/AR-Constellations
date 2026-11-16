import { ConstellationData } from "../Data/ConstellationData";
import { formatDec, formatRA } from "../Utils";
import { StarsData } from "Scirpts/Data/StarsData";

@component
export class StarCardContentUpdate extends BaseScriptComponent {
    
    @input
    title!: Text;

    @input
    ra!: Text;

    @input
    dec!: Text;

    @input
    appMag!: Text;

    @input
    absMag!: Text;

    @input
    distance!: Text;

    @input
    spectral!: Text;

    @input
    constName!: Text;

    public object: SceneObject | null = null;

    onAwake() {
    }

    public contentUpdate(object: SceneObject | null) {
        
        const textName = object?.getChild(1).getComponent("Component.Text").text
        StarsData.forEach((item: any) => {
            if(item.name === textName) {
                this.title.text = item.name;
                this.ra.text = formatRA(item.right_ascension);
                this.dec.text = formatDec(item.declination);
                this.appMag.text = item.apparent_magnitude.toString();
                this.absMag.text = item.absolute_magnitude.toString();
                this.distance.text = item.distance_light_year + " l.y.";
                this.spectral.text = item.spectral_class;
                this.constName.text = item.constellation;
            }
        })
    }
}
