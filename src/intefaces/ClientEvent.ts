import DiscordSM from '../classes/Client';

interface ClientEvent {
    name?: string;
    run: EventRun;
}

interface EventRun {
    (client: DiscordSM, ...args: any[]): any | Promise<any>;
}

export = ClientEvent;