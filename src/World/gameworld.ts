import {ISystem} from "../ECS/System/system";
import {ComponentManager} from "../ECS/Component/componentmanager";
import {RenderingSystem} from "../ECS/System/rendersystem";
import {Window} from "../Window/window";
import {RandomNumberGenerator} from "../Helper/randomnumbergenerator";
import {TreeFactory} from "../ECS/Entity/treefactory";
import {LifecycleSystem} from "../ECS/System/lifecyclesystem";
import {MushroomFactory} from "../ECS/Entity/mushroomfactory";
import {MessageBus} from "../MessageBus/messagebus";
import {DebugEmitterSystem} from "../ECS/System/Debug/debugemittersystem";

export class GameWorld {
    private debugCount = 0;

    public static readonly WIDTH = 32;
    public static readonly HEIGHT = 32;

    private readonly componentManager: ComponentManager;
    private readonly messageBus: MessageBus;
    private readonly window: Window;
    private readonly systems: ISystem[];

    constructor() {
        this.window = new Window(32, 32);
        this.componentManager = new ComponentManager();
        this.messageBus = new MessageBus(this.componentManager);
        this.systems = [];

        this.systems.push(new RenderingSystem(this.componentManager, this.window));
        this.systems.push(new LifecycleSystem(this.componentManager));

        //DEBUG
        this.systems.push(new DebugEmitterSystem(this.componentManager, this.messageBus));
    }

    public update(): void{
        for(const system of this.systems){
            system.update();
        }

        console.log(this.debugCount);
        ++this.debugCount;
    }

    public render(): void{
        this.window.clear();
        const renderingSystem = this.systems.find(system => system instanceof RenderingSystem) as RenderingSystem;
        if (renderingSystem) {
            renderingSystem.render();
        }
    }

    public debug(): void{
        const treeFactory = new TreeFactory();
        const mushroomFactory = new MushroomFactory();

        for(let c = 0; c < GameWorld.WIDTH; ++c){
            for(let r = 0; r < GameWorld.HEIGHT; ++r){
                const rand = RandomNumberGenerator.randomInt(0, 100);
                if(rand > 98){
                    const colorVariant = RandomNumberGenerator.randomInt(-60, 60);
                    treeFactory.createEntity(this.componentManager, c, r, colorVariant);
                }
                else if(rand < 2){
                    const colorVariant = RandomNumberGenerator.randomInt(-15, 15);
                    mushroomFactory.createEntity(this.componentManager, c, r, colorVariant);
                }
            }
        }
    }
}
