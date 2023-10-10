import {ComponentManager} from "../ECS/Component/componentmanager";

export type LifecycleState = {
    minDuration: number;
    maxDuration: number;
    onTransition?: (componentManager: ComponentManager, x: number, y: number) => void;
    diesOnTransition: boolean;
};
