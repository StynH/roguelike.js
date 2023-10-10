/* eslint-disable @typescript-eslint/no-explicit-any */
import {Component} from "./component";
import {Entity} from "../../Type/entity";
import {Position} from "./position";
import {Layer} from "./layer";
import {LayerType} from "../../Enum/layertype";

export class ComponentManager {
    private nextEntityId: Entity = 0;
    private componentStores: Map<string, Map<Entity, Component>> = new Map();

    public createEntity(): Entity {
        return this.nextEntityId++;
    }

    public createEntityWithComponents(components: Component[]): Entity {
        const entity = this.createEntity();
        components.forEach((component) => this.addComponent(entity, component));
        return entity;
    }

    public addComponent(entity: Entity, component: Component): void {
        const componentName = component.constructor.name;

        if (!this.componentStores.has(componentName)) {
            this.componentStores.set(componentName, new Map());
        }

        const store = this.componentStores.get(componentName)!;
        store.set(entity, component);
    }

    public getComponent<T extends Component>(entity: Entity, componentClass: new (...args: any[]) => T): T | null {
        const componentName = componentClass.name;
        const store = this.componentStores.get(componentName);
        return (store?.get(entity) as T) || null;
    }

    public getAllComponents<T extends Component>(componentClass: new (...args: any[]) => T): Map<Entity, Component> | undefined {
        const componentName = componentClass.name;
        return this.componentStores.get(componentName);
    }

    public getEntitiesWithComponent<T extends Component>(componentClass: new (...args: any[]) => T): Entity[] {
        const componentName = componentClass.name;
        const store = this.componentStores.get(componentName);
        return store ? Array.from(store.keys()) : [];
    }

    public removeEntity(entity: Entity): void{
        this.componentStores.forEach((entityToComponentMap) => {
            entityToComponentMap.delete(entity);
        });
    }

    public entityExistsAt(x: number, y: number, layer: LayerType): Entity | null {
        const entitiesWithPosition = this.getEntitiesWithComponent(Position);
        const matchingEntities = entitiesWithPosition.filter(entity => {
            const position = this.getComponent(entity, Position);
            const entityLayer = this.getComponent(entity, Layer);
            return position && entityLayer && position.x === x && position.y === y && entityLayer.layer === layer;
        });

        return matchingEntities.length >0 ? matchingEntities[0] : null;
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
