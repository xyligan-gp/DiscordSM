import DiscordSM from '../classes/Client';

export default interface ClientEvent {
    name?: string;
    run: EventRun;
}

interface EventRun {
    (client: DiscordSM, ...args: any[]): any | Promise<any>;
}