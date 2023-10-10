import {Char} from "../../Type/char";
import {IEntityFactory} from "./entityfactory";
import {ComponentManager} from "../Component/componentmanager";
import {Position} from "../Component/position";
import {Color} from "../Component/color";
import {ColorManipulator} from "../../Helper/colormanipulator";
import {Renderable} from "../Component/renderable";
import {Layer} from "../Component/layer";
import {LayerType} from "../../Enum/layertype";
import {DebugScan} from "../Component/Debug/debugscan";

export class MushroomFactory implements IEntityFactory {
    public createEntity(componentManager: ComponentManager, c: number, r: number, colorVariant: number): void {
        componentManager.createEntityWithComponents([
            new Position(c, r),
            new Color(ColorManipulator.adjustColor("#94a7a0", colorVariant)),
            new Renderable('Ô' as Char),
            new Layer(LayerType.ENTITY),
            new DebugScan(5, 0, 1)
        ]);
    }
}
