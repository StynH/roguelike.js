import {ComponentManager} from "../Component/componentmanager";
import {Lifecycle} from "../Component/lifecycle";
import {Position} from "../Component/position";

export class LifecycleSystem {
    constructor(private componentManager: ComponentManager) {}

    update() {
        const entities = this.componentManager.getEntitiesWithComponent(Lifecycle);
        entities.forEach(entity => {
            const lifecycle = this.componentManager.getComponent(entity, Lifecycle);
            const position = this.componentManager.getComponent(entity, Position);
            if (!lifecycle || !position) return;

            lifecycle.turnsRemaining--;

            if (lifecycle.turnsRemaining <= 0) {
                const currentState = lifecycle.states[lifecycle.currentState];

                if (currentState.onTransition) {
                    currentState.onTransition(this.componentManager, position.x, position.y);
                }

                if(currentState.diesOnTransition){
                    this.componentManager.removeEntity(entity);
                }
            }
        });
    }
}
