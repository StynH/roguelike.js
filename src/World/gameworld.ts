import {ISystem} from "../ECS/System/system";
import {ComponentManager} from "../ECS/Component/componentmanager";
import {RenderingSystem} from "../ECS/System/rendersystem";
import {Window} from "../Window/window";
import {RandomNumberGenerator} from "../Helper/randomnumbergenerator";
import {LifecycleSystem} from "../ECS/System/lifecyclesystem";
import {MessageBus} from "../MessageBus/messagebus";
import {FlowerFactory} from "../ECS/Entity/flowerfactory";
import {PollinatorSystem} from "../ECS/System/Genetics/pollinatorsystem";

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
        this.systems.push(new PollinatorSystem(this.componentManager, this.messageBus));
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
        const flowerFactory = new FlowerFactory();

        for(let c = 0; c < GameWorld.WIDTH; ++c){
            for(let r = 0; r < GameWorld.HEIGHT; ++r){
                const rand = RandomNumberGenerator.randomInt(0, 100);
                if(rand > 98){
                    flowerFactory.createEntity(this.componentManager, c, r);
                }
            }
        }
    }
}
