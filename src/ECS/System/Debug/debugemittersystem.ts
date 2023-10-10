import {ISystem} from "../system";
import {ComponentManager} from "../../Component/componentmanager";
import {MessageBus} from "../../../MessageBus/messagebus";
import {DebugScan} from "../../Component/Debug/debugscan";
import {EntityFilter} from "../../../Type/entityfilter";
import {Entity} from "../../../Type/entity";
import {Position} from "../../Component/position";
import {MathHelper} from "../../../Helper/mathhelper";

export class DebugEmitterSystem implements ISystem{

    constructor(private componentManager: ComponentManager, private messageBus: MessageBus) {
    }

    public update(): void {
        const debugScanners = this.componentManager.getAllComponents(DebugScan);
        if(debugScanners != null){
            for (const [entity, component] of debugScanners) {
                const debugScanner = component as DebugScan;
                const position = this.componentManager.getComponent(entity, Position);

                if(debugScanner.counter === debugScanner.interval && position != null){
                    const filterFunc = this.withinRangeFilter(position, debugScanner.range);
                    this.messageBus.send("debugScannerEmit", filterFunc, `Hello from Entity #${entity}`)
                    debugScanner.counter = 0;
                }
                else{
                    ++debugScanner.counter;
                }
            }
        }
    }

    private withinRangeFilter(origin: Position, range: number): EntityFilter {
        return (entity: Entity) => {
            const position = this.componentManager.getComponent(entity, Position);
            if (!position){
                return false;
            }

            const distance = MathHelper.chebyshevDistance(origin.x, origin.y, position.x, position.y);
            return distance <= range;
        };
    }
}
