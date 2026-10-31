import { ConstellationData } from "./Data/ConstellationData";
import { formatDec, formatRA } from "./Utils";
import { CardContentUpdate } from "./Cards/CardContentUpdate";

@component
export class Manager extends BaseScriptComponent {

    @input
    card!: SceneObject;

    @input
    consName!: string;

    @input
    cardContentUpdateScript!: CardContentUpdate;

    public activeConstellation: SceneObject | null = null;
    
    onAwake() {
       //this.card.enabled = false;
    }

    public openConsCard() {
        this.cardContentUpdateScript.contentUpdate(this.activeConstellation);
        this.card.enabled = true;
    }

    public activateConstellation() {
        this.openConsCard()
    }

    
}


