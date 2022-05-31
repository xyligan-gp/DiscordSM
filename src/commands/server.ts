import ClientCommand from '../intefaces/ClientCommand';

import { query, Type } from 'gamedig';
import { ApplicationCommandOptionType, GuildMember } from 'discord.js';

import config from '../configs/client.config.json';
import languages from '../configs/client.languages.json';

import servers from '../configs/client.servers.json';

export default {
    name: 'server',
    description: require(`../locales/${languages.find(locale => locale.tag === config.defaultLanguage).name}.json`).commands.server.info,
    cooldown: '10s',

    options: [
        {
            name: 'name',
            type: ApplicationCommandOptionType.String,
            description: 'Server Name',
            required: true,

            choices: servers
        }
    ],

    run: async(client, command, subCommand) => {
        const member = command.member as GuildMember;

        const serverValue = command.options.get('name')?.value as string;

        const serverInfo = serverValue.split('|');

        const serverType = serverInfo[0];
        const serverIP = serverInfo[1];
        const serverPort = serverInfo[2];
        const serverLogo = serverInfo[3];

        query({ type: serverType as Type, host: serverIP, port: Number(serverPort), maxAttempts: 1, attemptTimeout: 10000, socketTimeout: 1000 }).then((data: any) => {
            let playersList: string = '';

            data.players.forEach((player: any) => {
                if(player.raw?.time) {
                    const hours = Math.floor(player.raw?.time / 3600);
                    const minutes = Math.floor(player.raw?.time / 60 % 60);
                    const seconds = Math.floor(player.raw?.time % 60);

                    const formattedTime = client.utils.formatNumbers([hours, minutes, seconds]);

                    playersList += client.phrases.commands.server.playersList.replace('{nickname}', player.name ? player.name : client.phrases.commands.server.unknownName).replace('{time}', `[${formattedTime[0]}:${formattedTime[1]}:${formattedTime[2]}]`).replace('{score}', player.raw?.score ? `[${player.raw.score || 0}]` : client.phrases.commands.server.unknownScore);
                }else{
                    playersList += client.phrases.commands.server.playersList.replace('{nickname}', player.name ? player.name : client.phrases.commands.server.unknownName).replace('{time}', client.phrases.commands.server.unknownTime).replace('{score}', player.raw?.score ? `[${player.raw.score || 0}]` : client.phrases.commands.server.unknownTime);
                }
            })

            const info = client.utils.buildEmbed({ author: { name: client.phrases.commands.server.embed.title.replace('{server}', data.name), icon_url: serverLogo || client.user.avatarURL() || command.guild.iconURL() }, thumbnail: { url: serverLogo || client.user.avatarURL() || command.guild.iconURL() }, description: '-', fields: [
                { name: client.phrases.commands.server.embed.fields.map, value: data.map, inline: true },
                { name: client.phrases.commands.server.embed.fields.description, value: data.raw?.game || client.phrases.commands.server.unknownDescription, inline: true },
                { name: client.phrases.commands.server.embed.fields.id, value: data.raw?.steamid || client.phrases.commands.server.unknownSteamID, inline: true },
                { name: client.phrases.commands.server.embed.fields.players, value: data.players.length.toString(), inline: true },
                { name: client.phrases.commands.server.embed.fields.protected, value: client.phrases.status[data.password ? 'true' : 'false'], inline: true },
                { name: client.phrases.commands.server.embed.fields.maxPlayers, value: data.maxplayers.toString(), inline: true },
                { name: client.phrases.commands.server.embed.fields.playersList, value: data.players.length ? playersList : client.phrases.commands.server.notPlayers }
            ] }, member, true, true);

            return command.reply({ embeds: [info] });
        }).catch((error: Error) => {
            const failFetchData = client.utils.buildEmbed({ description: client.phrases.commands.server.failFetchData }, null);

            return command.reply({ embeds: [failFetchData] });
        })
    }
} as ClientCommand;