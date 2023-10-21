import {ISystem} from "../system";
import {ComponentManager} from "../../Component/componentmanager";
import {MessageBus} from "../../../MessageBus/messagebus";
import {Position} from "../../Component/position";
import {EntityFilter} from "../../../Type/entityfilter";
import {Entity} from "../../../Type/entity";
import {MathHelper} from "../../../Helper/mathhelper";
import {Pollinator} from "../../Component/Genetics/pollinator";
import {DNA} from "../../Component/Genetics/dna";

export class PollinatorSystem implements ISystem{

    constructor(private componentManager: ComponentManager, private messageBus: MessageBus) {
    }

    public update(): void {
        const pollinators = this.componentManager.getAllComponents(Pollinator);
        if(pollinators != null){
            for (const [entity, component] of pollinators) {
                const pollinator = component as Pollinator;
                const position = this.componentManager.getComponent(entity, Position);

                if(pollinator.counter === pollinator.interval && position != null){
                    const dna = this.componentManager.getComponent(entity, DNA)!;
                    const filterFunc = this.withinRangeFilter(position, pollinator.range);
                    this.messageBus.send("flowerPollination", filterFunc, entity, dna)
                    pollinator.counter = 0;
                }
                else{
                    ++pollinator.counter;
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
