import {MessageHandler} from "../../Type/messagehandler";

export class MessageReceiver {
    public handlers: { [key: string]: MessageHandler } = {};

    public register(key: string, handler: MessageHandler) {
        this.handlers[key] = handler;
    }
}
