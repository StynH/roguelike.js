import {Char} from "../../Type/char";
import {IEntityFactory} from "./entityfactory";
import {ComponentManager} from "../Component/componentmanager";
import {Position} from "../Component/position";
import {Color} from "../Component/color";
import {ColorManipulator} from "../../Helper/colormanipulator";
import {Renderable} from "../Component/renderable";
import {LifecycleState} from "../../Type/lifecyclestate";
import {Lifecycle} from "../Component/lifecycle";
import {RandomNumberGenerator} from "../../Helper/randomnumbergenerator";
import {GameWorld} from "../../World/gameworld";
import {Layer} from "../Component/layer";
import {LayerType} from "../../Enum/layertype";
import {MessageReceiver} from "../Component/messagreceiver";
import "../../Extension/array"

export class TreeFactory implements IEntityFactory {
    private treeStates: Record<string, LifecycleState> = {
        stump: {
            minDuration: 10,
            maxDuration: 15,
            diesOnTransition: true
        },
        tree: {
            minDuration: 15,
            maxDuration: 25,
            diesOnTransition: true,
            onTransition: (componentManager: ComponentManager, x: number, y: number) => {
                const numAcorns = RandomNumberGenerator.randomInt(0, 3);

                const positions = [
                    { x: x - 1, y: y },
                    { x: x + 1, y: y },
                    { x: x, y: y - 1 },
                    { x: x, y: y + 1 },
                    { x: x + 1, y: y + 1 },
                    { x: x - 1, y: y - 1 },
                    { x: x - 1, y: y + 1 },
                    { x: x + 1, y: y - 1 }
                ]
                .filter(pos => pos.x >= 0 && pos.x < GameWorld.WIDTH && pos.y >= 0 && pos.y < GameWorld.HEIGHT)
                .shuffle();

                for (let i = 0; i < numAcorns; i++) {
                    if(positions.length < i || positions[i] == null){
                        break;
                    }

                    const existing = componentManager.entityExistsAt(positions[i].x, positions[i].y, LayerType.ENTITY)
                    if(existing){
                        continue;
                    }

                    componentManager.createEntityWithComponents([
                        new Position(positions[i].x, positions[i].y),
                        new Renderable('O' as Char),
                        new Color("#917037"),
                        new Lifecycle('acorn', this.treeStates)
                    ]);
                }

                componentManager.createEntityWithComponents([
                    new Position(x, y),
                    new Renderable('Ï' as Char),
                    new Color("#3d2f17"),
                    new Lifecycle('stump', this.treeStates)
                ]);
            }
        },
        acorn: {
            minDuration: 5,
            maxDuration: 10,
            diesOnTransition: true,
            onTransition: (componentManager: ComponentManager, x: number, y: number) => {
                componentManager.createEntityWithComponents([
                    new Position(x, y),
                    new Renderable('ī' as Char),
                    new Color("#bbde99"),
                    new Layer(LayerType.ENTITY),
                    new Lifecycle('sapling', this.treeStates)
                ]);
            }
        },
        sapling: {
            minDuration: 15,
            maxDuration: 20,
            diesOnTransition: true,
            onTransition: (componentManager: ComponentManager, x: number, y: number) => {
                const colorVariant = RandomNumberGenerator.randomInt(-60, 60);
                const entity = componentManager.createEntityWithComponents([
                    new Position(x, y),
                    new Renderable('Ī' as Char),
                    new Layer(LayerType.ENTITY),
                    new Color(ColorManipulator.adjustColor("#94D893", colorVariant)),
                    new Lifecycle('tree', this.treeStates),
                    new MessageReceiver()
                ]);
                const messageReceiver = componentManager.getComponent(entity, MessageReceiver)!;
                messageReceiver.register("debugScannerEmit", () => {
                    componentManager.removeEntity(entity);
                    componentManager.createEntityWithComponents([
                        new Position(x, y),
                        new Renderable('Ï' as Char),
                        new Color("#3d2f17"),
                        new Lifecycle('stump', this.treeStates)
                    ]);
                });
            }
        }
    };

    public createEntity(componentManager: ComponentManager, c: number, r: number, colorVariant: number): void {
        componentManager.createEntityWithComponents([
            new Position(c, r),
            new Color(ColorManipulator.adjustColor("#94D893", colorVariant)),
            new Renderable('Ī' as Char),
            new Layer(LayerType.ENTITY),
            new Lifecycle('tree', this.treeStates)
        ]);
    }
}
