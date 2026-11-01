import Easing from "LSTween.lspkg/TweenJS/Easing";
import { CardContentUpdate } from "./Cards/CardContentUpdate";
import { turnOnAllStarsLabels, turnOffAllStarsLabels, setActiveLineMaterial, setDefaultLineMaterial } from "./VisibilitiModes";
import { LSTween } from "LSTween.lspkg/LSTween";
import { getChildByName } from "./Utils";

@component
export class Manager extends BaseScriptComponent {

    @input
    card!: SceneObject;

    @input
    cardContentUpdateScript!: CardContentUpdate;

    @input
    defaultLineMat!: Material;

    @input
    activeLineMat!: Material;

    @input
    sun!: SceneObject;

    @input
    target!: SceneObject;

    @input
    world!: SceneObject;


    public currentCons: SceneObject | null = null;
    public prevCons: SceneObject | null = null;
    
    onAwake() {
        this.card.enabled = false;
        
        //this.rotateWorldToTarget();
    }

    private onStart(): void {
        
    }

    public openConsCard() {
        this.cardContentUpdateScript.contentUpdate(this.currentCons);
        this.card.enabled = true;
    }

    public activateConstellation() {
        if (this.prevCons === this.currentCons) return

        if (this.prevCons) {
            turnOffAllStarsLabels(this.prevCons)
            setDefaultLineMaterial(this.prevCons, this.defaultLineMat)
        }
        this.rotateWorldToTarget(this.currentCons!)
        turnOnAllStarsLabels(this.currentCons!) 
        setActiveLineMaterial(this.currentCons!, this.activeLineMat)
        this.openConsCard()
        this.prevCons = this.currentCons; 
    }

    public rotateWorldToTarget(currentCons: SceneObject) {

        if (!currentCons) return;

        const worldTransform = this.world.getTransform();
        const worldPos = worldTransform.getWorldPosition();

        // 1. Получаем истинные векторы направления от центра сферы до объектов
        const targetPos = this.target.getTransform().getWorldPosition();
        const targetDir = targetPos.sub(worldPos).normalize();

        const consPos = currentCons.getTransform().getWorldPosition();
        const consDir = consPos.sub(worldPos).normalize();

        // 2. Вычисляем дельту поворота между двумя направлениями
        const deltaRot = quat.rotationFromTo(consDir, targetDir);

        // 3. Добавляем дельту к текущему повороту сферы (через умножение кватернионов)
        const currentRot = worldTransform.getWorldRotation();
        const finalRot = deltaRot.multiply(currentRot);

        //worldTransform.setWorldRotation(finalRot);

        LSTween.rotateToLocal(
            worldTransform, 
            finalRot,
            1000
        )
        .easing(Easing.Quadratic.InOut)
        .start()
    } 
}


