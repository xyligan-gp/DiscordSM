/* NPM Packages */
import sftp from 'sftp-async';
import { Client as FTPClient } from 'basic-ftp';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';

/* Client Configurations */
import config from '../configs/client.config.json';
import servers from '../configs/client.servers.json';
import statuses from '../configs/client.statuses.json';
import languages from '../configs/client.languages.json';

/* Client Addons */
import ClientLogger from './ClientLogger';

/* Client Managers */
import UtilsManager from './managers/UtilsManager';

/* Client Interfaces */
import DefaultConfig from '../intefaces/DefaulConfig';
import ClientCommand from '../intefaces/ClientCommand';

/* Client Locales */
import English from '../locales/English.json';
import Russian from '../locales/Russian.json';
import Ukrainian from '../locales/Ukrainian.json';

class DiscordSM extends Client {
    public configs: DefaultConfig = {
        main: config,
        servers: servers,
        statuses: statuses,
        languages: languages
    }

    public cooldowns: Collection<string, number> = new Collection();
    public commands: Collection<string, ClientCommand> = new Collection();
    public phrases: typeof English = require(`../locales/${this.configs.languages.find(lang => lang.tag === this.configs.main.defaultLanguage).name}.json`);

    public ftp: FTPClient = new FTPClient();
    public sftp: sftp = sftp;

    public logger: ClientLogger = new ClientLogger();
    public utils: UtilsManager = new UtilsManager(this);
    
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages
            ],

            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.Reaction,
                Partials.User
            ],

            rest: {
                offset: 0
            }
        })
    }

    public start(): void {
        this.utils.initialClient();
        this.login(this.configs.main.token);
    }
}

export = DiscordSM;