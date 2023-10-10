import {ComponentManager} from "../ECS/Component/componentmanager";
import {MessageReceiver} from "../ECS/Component/messagreceiver";
import {EntityFilter} from "../Type/entityfilter";

export class MessageBus {

    private componentManager: ComponentManager;

    constructor(componentManager: ComponentManager) {
        this.componentManager = componentManager;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    public send(key: string, filter: EntityFilter | null, ...args: any[]) {
        const receivers = this.componentManager.getAllComponents(MessageReceiver);

        if(receivers == null){
            return;
        }

        for (const [entity, component] of receivers) {
            if(filter != null && !filter(entity)){
                continue;
            }

            const receiver = component as MessageReceiver;
            if (receiver && receiver.handlers[key]) {
                receiver.handlers[key](...args);
            }
        }
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

}
