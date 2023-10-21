import { Component } from "./component";
import { Entity } from "../../Type/entity";
import { Position } from "./position";
import { Layer } from "./layer";
import { LayerType } from "../../Enum/layertype";
import { Identifier } from "./identifier";

/* eslint-disable @typescript-eslint/no-explicit-any */
type ComponentConstructor<T extends Component = Component> = new (...args: any[]) => T;
/* eslint-enable @typescript-eslint/no-explicit-any */

export class ComponentManager {
    private nextEntityId: Entity = 0;
    private componentStores: Map<string, Map<Entity, Component>> = new Map();

    public createEntity(): Entity {
        return this.nextEntityId++;
    }

    public createEntityWithComponents(components: Component[]): Entity {
        if (!components.some(c => c instanceof Identifier)) {
            throw new Error("Attempt at creating entity without identifier!");
        }

        const entity = this.createEntity();
        components.forEach(component => this.addComponent(entity, component));
        return entity;
    }

    public addComponent<T extends Component>(entity: Entity, component: T): void {
        const componentName = component.constructor.name;

        if (!this.componentStores.has(componentName)) {
            this.componentStores.set(componentName, new Map());
        }

        const store = this.componentStores.get(componentName)!;
        store.set(entity, component);
    }

    public getComponent<T extends Component>(entity: Entity, componentClass: ComponentConstructor<T>): T | null {
        const componentName = componentClass.name;
        const store = this.componentStores.get(componentName);
        return (store?.get(entity) as T | undefined) || null;
    }

    public getAllComponents<T extends Component>(componentClass: ComponentConstructor<T>): Map<Entity, T> | undefined {
        const componentName = componentClass.name;
        return this.componentStores.get(componentName) as Map<Entity, T> | undefined;
    }

    public getEntitiesWithComponent<T extends Component>(componentClass: ComponentConstructor<T>): Entity[] {
        const componentName = componentClass.name;
        const store = this.componentStores.get(componentName);
        return store ? Array.from(store.keys()) : [];
    }

    public removeEntity(entity: Entity): void {
        this.componentStores.forEach(store => store.delete(entity));
    }

    public entityExistsAt(x: number, y: number, layer: LayerType): Entity | null {
        const entitiesWithPosition = this.getEntitiesWithComponent(Position);
        const matchingEntity = entitiesWithPosition.find(entity => {
            const position = this.getComponent(entity, Position);
            const entityLayer = this.getComponent(entity, Layer);
            return position && entityLayer && position.x === x && position.y === y && entityLayer.layer === layer;
        });

        return matchingEntity ?? null;
    }
}
