import { ConstellationData } from "./Data/ConstellationData";
import { formatDec, formatRA } from "./Utils";

@component
export class Manager extends BaseScriptComponent {

    @input
    frame!: SceneObject;

   

    @input
    consName!: string;
    
    onAwake() {
        this.contentFiller(this.consName)
    }

    public openCard(prefab: ObjectPrefab) {

        


    }

    public contentFiller(name: string) {
        ConstellationData.forEach((item: any) => {
            if(item.name === name) {
                const title = this.frame.getChild(0).getChild(0).getComponent("Component.Text").text = item.name;
                let values = this.frame.getChild(0).getChild(2);
                values.getChild(0).getComponent("Component.Text").text = formatRA(item.right_ascension);
                values.getChild(1).getComponent("Component.Text").text = formatDec(item.right_ascension);
                values.getChild(2).getComponent("Component.Text").text = item.square + " sq.d.";
                values.getChild(3).getComponent("Component.Text").text = item.main_stars_qty  + " stars";
                values.getChild(4).getComponent("Component.Text").text = item.brightest_star;
                let list = "";
                for (let i = 0; i < item.list_of_main_stars.length; i++) {
                    list = list + item.list_of_main_stars[i] + ", "
                }
                values.getChild(5).getComponent("Component.Text").text = list;


            }
        })

    }

    /* public toggleObject(obj: SceneObject) {
        if(!this.frame) return;
        //this.cube.enabled = !this.cube.enabled

    } */
}


