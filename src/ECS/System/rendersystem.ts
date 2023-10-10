import {ComponentManager} from "../Component/componentmanager";
import {Position} from "../Component/position";
import {Renderable} from "../Component/renderable";
import {ISystem} from "./system";
import {Window} from "../../Window/window";
import {Color} from "../Component/color";
import {Layer} from "../Component/layer";

export class RenderingSystem implements ISystem {
    constructor(private componentManager: ComponentManager, private window: Window) {}

    render() {
        const entitiesWithPosition = this.componentManager.getEntitiesWithComponent(Position);
        const entitiesWithRenderable = this.componentManager.getEntitiesWithComponent(Renderable);

        const renderableEntities = entitiesWithPosition.filter(entity =>
            entitiesWithRenderable.includes(entity)
        );

        // Sort entities by their layer.
        renderableEntities.sort((a, b) => {
            const layerA = this.componentManager.getComponent(a, Layer)?.layer ?? 0;
            const layerB = this.componentManager.getComponent(b, Layer)?.layer ?? 0;
            return layerA - layerB;
        });

        renderableEntities.forEach(entity => {
            const position = this.componentManager.getComponent(entity, Position);
            const renderable = this.componentManager.getComponent(entity, Renderable);
            const color = this.componentManager.getComponent(entity, Color);

            if (position && renderable) {
                this.drawAt(position.x, position.y, renderable.symbol, color?.color);
            }
        });
    }

    drawAt(x: number, y: number, symbol: string, color: string | undefined) {
        if (color) {
            this.window.drawAtColored(x, y, symbol, color);
            return;
        }
        this.window.drawAt(x, y, symbol);
    }

    update(): void {
        // void
    }
}
