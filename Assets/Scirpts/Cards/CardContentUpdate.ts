import { ConstellationData } from "../Data/ConstellationData";
import { formatDec, formatRA } from "../Utils";

@component
export class CardContentUpdate extends BaseScriptComponent {
    
    @input
    title!: Text;

    @input
    ra!: Text;

    @input
    dec!: Text;

    @input
    area!: Text;

    @input
    qty!: Text;

    @input
    brightest!: Text;

    @input
    stars!: Text;

    public object: SceneObject | null = null;

    onAwake() {
    }

    public contentUpdate(object: SceneObject | null) {
            ConstellationData.forEach((item: any) => {
                if(item.name === object!.name) {
                    this.title.text = item.name;
                    this.ra.text = formatRA(item.right_ascension);
                    this.dec.text = formatDec(item.right_ascension);
                    this.area.text = item.square + " sq.d.";
                    this.qty.text = item.main_stars_qty  + " stars";
                    this.brightest.text = item.brightest_star;
                    
                    let list = "";
                    for (let i = 0; i < item.list_of_main_stars.length; i++) {
                        list = list + item.list_of_main_stars[i] + ", "
                    }
                    this.stars.text = list;
                }
            })
        }

}
