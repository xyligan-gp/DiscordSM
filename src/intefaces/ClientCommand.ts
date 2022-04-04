import DiscordSM from '../classes/Client';

import ClientSubCommand from './ClientSubCommand';

import { ApplicationCommandOptionData, CommandInteraction, PermissionsString } from 'discord.js';

interface ClientCommand {
    name: string;
    description: string;
    cooldown?: string;
    onlyOwners?: boolean;
    onlyAdmins?: boolean;

    permissions?: {
        client?: Array<PermissionsString>;
        user?: Array<PermissionsString>;
    }

    options?: Array<ApplicationCommandOptionData>;

    run: CommandRun;
}

interface CommandRun {
    (client: DiscordSM, command: CommandInteraction, subCommand: ClientSubCommand | null): any | Promise<any>;
}

export = ClientCommand;