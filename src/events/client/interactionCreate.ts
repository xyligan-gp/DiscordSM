import ms from 'ms';
import { ApplicationCommandOptionType, GuildMember, Interaction } from 'discord.js';

import ClientEvent from '../../intefaces/ClientEvent';
import ClientSubCommand from '../../intefaces/ClientSubCommand';

export = {
    name: 'interactionCreate',
    
    run(client, interaction: Interaction) {
        if(!interaction.inGuild()) return;
        if(!interaction.isChatInputCommand()) return;

        const guild = interaction.guild;
        const member = interaction.member as GuildMember;
        const cmd = interaction.commandName;
        const clientCommand = client.commands.get(cmd);

        if(clientCommand) {
            if(!guild.me.permissions.has('SendMessages')) return member.send({ content: client.phrases.permissions.messages });
            if(!guild.me.permissions.has('EmbedLinks')) return member.send({ content: client.phrases.permissions.embeds });

            if(clientCommand.permissions?.client?.length) {
                if(!guild.me.permissions.has(clientCommand.permissions.client)) return interaction.reply({ embeds: [client.utils.buildEmbed({ description: client.phrases.permissions.missingClient }, null)] });
            }

            if(clientCommand.permissions?.user?.length) {
                if(!member.permissions.has(clientCommand.permissions.user)) return interaction.reply({ embeds: [client.utils.buildEmbed({ description: client.phrases.permissions.missingUser.replace('{user}', member.toString()) }, null)] })
            }

            if(clientCommand.onlyOwners && !client.configs.main.owners.includes(member.id)) return interaction.reply({ embeds: [client.utils.buildEmbed({ description: client.phrases.onlyForOwners }, null)] });
            if(clientCommand.onlyAdmins && !client.configs.main.admins.includes(member.id)) return interaction.reply({ embeds: [client.utils.buildEmbed({ description: client.phrases.onlyForAdmins }, null)] });

            const interactionOptionsData = interaction.options.data[0];
            const subCommand: ClientSubCommand = { group: null, name: null, options: null }

            if(typeof interactionOptionsData == 'object') {
                if(interactionOptionsData.type === ApplicationCommandOptionType.Subcommand) {
                    subCommand.name = interactionOptionsData.name;
                    subCommand.options = interactionOptionsData.options?.map(option => option?.value) as string[] || null;
                }else if(interactionOptionsData.type === ApplicationCommandOptionType.SubcommandGroup) {
                    subCommand.group = interactionOptionsData.name;
                    subCommand.name = interactionOptionsData.options[0].name;
                    subCommand.options = interactionOptionsData.options[0].options.map(option => option?.value) as string[] || null;
                }
            }

            if(clientCommand.cooldown) {
                const commandCooldown = ms(clientCommand.cooldown);

                if(client.cooldowns.has(`${clientCommand.name}.${member.id}`)) return interaction.reply({ embeds: [client.utils.buildEmbed({ description: client.phrases.commandCooldown.replace('{cName}', clientCommand.name).replace('{cTime}', ms(client.cooldowns.get(`${clientCommand.name}.${member.id}`) - Date.now()).toString()) }, null)] })

                client.cooldowns.set(`${clientCommand.name}.${member.id}`, Date.now() + commandCooldown);
                clientCommand.run(client, interaction, subCommand.name ? subCommand : null);

                setTimeout(() => {
                    client.cooldowns.delete(`${clientCommand.name}.${member.id}`);
                }, commandCooldown)
            }else return clientCommand.run(client, interaction, subCommand.name ? subCommand : null);
        }
    }
} as ClientEvent;