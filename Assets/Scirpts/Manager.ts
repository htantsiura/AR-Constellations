import Easing from "LSTween.lspkg/TweenJS/Easing";
import { CardContentUpdate } from "./Cards/CardContentUpdate";
import { turnOnAllStarsLabels, turnOffAllStarsLabels, setActiveLineMaterial, setDefaultLineMaterial } from "./VisibilitiModes";
import { LSTween } from "LSTween.lspkg/LSTween";
import { consQuatMap } from "./Config";

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

        const worldTransform = this.world.getTransform();
    
        //getting base constellation Rot from Map
        const consName = currentCons.name.replace(/[.,!?]/g, "").trim() //args.text.replace(/[.,!?]/g, "").trim().toLowerCase();
        const baseConsRot = consQuatMap.get(consName);

        // getting targetRot
        const worldPos = this.world.getTransform().getWorldPosition();
        const targetPos = this.target.getTransform().getWorldPosition();
        const targetAngle = Math.atan2(worldPos.x - targetPos.x, worldPos.z - targetPos.z);
        const targetRot = quat.angleAxis(targetAngle, vec3.up());

        // by multiplying quaternions - getting the rotation
        const finalRot = targetRot.multiply(baseConsRot!);

        LSTween.rotateToLocal(
            worldTransform, 
            finalRot,
            1000
        )
        .easing(Easing.Quadratic.InOut)
        .start()
    }

    public rotateWorldToTarget3(currentCons: SceneObject) {

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


