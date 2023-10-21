import {ComponentManager} from "../ECS/Component/componentmanager";
import {Entity} from "./entity";

export type LifecycleState = {
    minDuration: number;
    maxDuration: number;
    onTransition?: (componentManager: ComponentManager, x: number, y: number, entity: Entity) => void;
    diesOnTransition: boolean;
};
