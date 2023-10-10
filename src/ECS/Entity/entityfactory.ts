import {ComponentManager} from "../Component/componentmanager";

export interface IEntityFactory {
    createEntity(componentManager: ComponentManager, ...args: any[]): void;
}
