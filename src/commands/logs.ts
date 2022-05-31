import ClientCommand from '../intefaces/ClientCommand';

import { writeFileSync } from 'fs';
import { ApplicationCommandOptionType, Attachment } from 'discord.js';

import config from '../configs/client.config.json';
import languages from '../configs/client.languages.json';

import logs from '../configs/client.logs.json';
import ftps from '../configs/client.ftps.json';

export default {
    name: 'logs',
    description: require(`../locales/${languages.find(locale => locale.tag === config.defaultLanguage).name}.json`).commands.logs.info,
    cooldown: '10s',
    onlyAdmins: true,

    options: [
        {
            name: 'server',
            type: ApplicationCommandOptionType.String,
            description: 'Server Name',
            required: true,

            choices: ftps
        },

        {
            name: 'log',
            type: ApplicationCommandOptionType.String,
            description: 'Log Name',
            required: true,

            choices: logs
        }
    ],

    run: async(client, command, subCommand) => {
        const serverFTP = command.options.get('server')?.value as string;
        const serverLog = command.options.get('log')?.value as string;

        const ftpData = serverFTP.split('|');
        const directoryData = serverLog.split('|');

        const ftpType = ftpData[0] as 'ftp' | 'sftp';
        const rootType = ftpData[1] as 'root' | 'nonRoot';
        const rootPath = ftpData[2];
        const ftpHost = ftpData[3];
        const ftpPort = Number(ftpData[4]);
        const ftpUser = ftpData[5];
        const ftpPass = ftpData[6];

        const directoryPath = directoryData[0];
        const fileName = directoryData[1];
        const filePath = `./${rootType === 'root' ? `${rootPath}/` : ''}${directoryPath}`;

        if(ftpType === 'ftp') {
            client.ftp.access({ host: ftpHost, port: ftpPort, user: ftpUser, password: ftpPass }).then(connectData => {
                client.ftp.downloadTo(`./logs/${fileName}`, filePath).then(downloadData => {
                    const attachment = new Attachment(`./logs/${fileName}`, fileName);

                    return command.reply({ files: [attachment] });
                }).catch((error: Error) => {
                    const failGetFile = client.utils.buildEmbed({ description: client.phrases.commands.logs.failGetFile.replace('{path}', filePath) }, null);

                    return command.reply({ embeds: [failGetFile] });
                })
            }).catch((error: Error) => {
                const failConnect = client.utils.buildEmbed({ description: client.phrases.commands.logs.failConnect }, null);

                return command.reply({ embeds: [failConnect] });
            })
        }else if(ftpType === 'sftp') {
            client.sftp.connect(ftpHost, ftpPort, ftpUser, ftpPass).then((connectData: any) => {
                client.sftp.getFileData(filePath).then((downloadData: any) => {
                    writeFileSync(`./logs/${fileName}`, downloadData, { encoding: 'utf-8' });

                    const attachment = new Attachment(`./logs/${fileName}`, fileName);

                    return command.reply({ files: [attachment] })
                }).catch((error: Error) => {
                    const failGetFile = client.utils.buildEmbed({ description: client.phrases.commands.logs.failGetFile.replace('{path}', filePath) }, null);

                    return command.reply({ embeds: [failGetFile] });
                })
            }).catch((error: Error) => {
                const failConnect = client.utils.buildEmbed({ description: client.phrases.commands.logs.failConnect }, null);

                return command.reply({ embeds: [failConnect] });
            })
        }
    }
} as ClientCommand;