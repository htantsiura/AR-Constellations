@component
export class CloseCard extends BaseScriptComponent {

    @input
    card!: SceneObject

    public closeCard() {
        this.card.enabled = false;
    }
}
