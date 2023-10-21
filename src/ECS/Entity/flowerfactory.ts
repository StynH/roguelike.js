import {Char} from "../../Type/char";
import {IEntityFactory} from "./entityfactory";
import {ComponentManager} from "../Component/componentmanager";
import {Position} from "../Component/position";
import {Color} from "../Component/color";
import {Renderable} from "../Component/renderable";
import {LifecycleState} from "../../Type/lifecyclestate";
import {Lifecycle} from "../Component/lifecycle";
import {RandomNumberGenerator} from "../../Helper/randomnumbergenerator";
import {GameWorld} from "../../World/gameworld";
import {Layer} from "../Component/layer";
import {LayerType} from "../../Enum/layertype";
import {Genome} from "../../Genetics/genome";
import {DNA} from "../Component/Genetics/dna";
import {Fertilizable} from "../Component/Genetics/fertilizable";
import {Pollinator} from "../Component/Genetics/pollinator";
import {MessageReceiver} from "../Component/messagreceiver";
import {Entity} from "../../Type/entity";
import "../../Extension/array"
import {Identifier} from "../Component/identifier";

export class FlowerFactory implements IEntityFactory {
    private flowerStates: Record<string, LifecycleState> = {
        dead: {
            minDuration: 4,
            maxDuration: 7,
            diesOnTransition: true
        },
        flower: {
            minDuration: 15,
            maxDuration: 25,
            diesOnTransition: true,
            onTransition: (componentManager: ComponentManager, x: number, y: number, entity: Entity) => {
                const dna = componentManager.getComponent(entity, DNA)!;
                const fertilizable = componentManager.getComponent(entity, Fertilizable)!;

                if(dna && fertilizable.partnerDna){
                    const numSeeds = RandomNumberGenerator.randomInt(0, 3);

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

                    for (let i = 0; i < numSeeds; i++) {
                        const newGenomes = this.mergeDNA(dna, fertilizable.partnerDna);
                        if(positions.length < i || positions[i] == null){
                            break;
                        }

                        const existing = componentManager.entityExistsAt(positions[i].x, positions[i].y, LayerType.ENTITY)
                        if(existing){
                            continue;
                        }

                        componentManager.createEntityWithComponents([
                            new Identifier("Flower Seedling"),
                            new Position(positions[i].x, positions[i].y),
                            new Renderable('.' as Char),
                            new Color("#917037"),
                            new Lifecycle('seed', this.flowerStates),
                            new DNA(newGenomes)
                        ]);
                    }
                }

                componentManager.createEntityWithComponents([
                    new Identifier("Flower (Dead)"),
                    new Position(x, y),
                    new Renderable('#' as Char),
                    new Color("#3d2f17"),
                    new Lifecycle('dead', this.flowerStates),
                ]);
            }
        },
        seed: {
            minDuration: 5,
            maxDuration: 10,
            diesOnTransition: true,
            onTransition: (componentManager: ComponentManager, x: number, y: number, entity: Entity) => {
                const dna = componentManager.getComponent(entity, DNA)!;
                componentManager.createEntityWithComponents([
                    new Identifier("Seed"),
                    new Position(x, y),
                    new Renderable('f' as Char),
                    new Color("#bbde99"),
                    new Layer(LayerType.ENTITY),
                    new Lifecycle('sapling', this.flowerStates),
                    new DNA(dna.genomes)
                ]);
            }
        },
        sapling: {
            minDuration: 15,
            maxDuration: 20,
            diesOnTransition: true,
            onTransition: (componentManager: ComponentManager, x: number, y: number, entity: Entity) => {
                this.createOffspring(componentManager, x, y, entity);
            }
        }
    };

    private mergeDNA(first: DNA, second: DNA): Genome[]{
        const newGenomes = [];
        for (let i = 0; i < first.genomes.length; ++i){
            const firstGene = first.genomes[i];
            const secondGene = second.genomes[i];
            newGenomes.push(firstGene.crossover(secondGene));
        }
        return newGenomes;
    }

    public createOffspring(componentManager: ComponentManager, c: number, r: number, entity: Entity): void {
        const dna = componentManager.getComponent(entity, DNA)!;

        const newEntity = componentManager.createEntityWithComponents([
            new Identifier("Flower"),
            new Position(c, r),
            new Color(`#${dna.genomes[0].genes[0]}${dna.genomes[0].genes[1]}${dna.genomes[0].genes[2]}`),
            new Renderable(dna.genomes[1].genes[0] as Char),
            new Layer(LayerType.ENTITY),
            new Lifecycle('flower', this.flowerStates),
            new DNA(dna.genomes),
            new Fertilizable(),
            new Pollinator(),
            new MessageReceiver()
        ]);

        this.bindMessageReceiver(componentManager, newEntity);
    }

    public createEntity(componentManager: ComponentManager, c: number, r: number): void {
        const colorGenome = new Genome([RandomNumberGenerator.randomHex(2), RandomNumberGenerator.randomHex(2), RandomNumberGenerator.randomHex(2)]);
        const symbolGenome = new Genome([RandomNumberGenerator.randomInt(1, 2) == 1 ? '@' : '&']);

        const entity = componentManager.createEntityWithComponents([
            new Identifier("Flower"),
            new Position(c, r),
            new Color(`#${colorGenome.genes[0]}${colorGenome.genes[1]}${colorGenome.genes[2]}`),
            new Renderable(symbolGenome.genes[0] as Char),
            new Layer(LayerType.ENTITY),
            new Lifecycle('flower', this.flowerStates),
            new DNA([colorGenome, symbolGenome]),
            new Fertilizable(),
            new Pollinator(),
            new MessageReceiver()
        ]);

        this.bindMessageReceiver(componentManager, entity);
    }

    private bindMessageReceiver(componentManager: ComponentManager, entity: Entity){
        const messageReceiver = componentManager.getComponent(entity, MessageReceiver)!;
        messageReceiver.register("flowerPollination", (other: Entity, dna: DNA) => {
            const fertilizable = componentManager.getComponent(entity, Fertilizable)!;
            if(other != entity && fertilizable.partnerDna == null){
                fertilizable.partnerDna = dna;
            }
        });
    }
}
