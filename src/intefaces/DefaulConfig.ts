import config from '../configs/client.config.json';
import servers from '../configs/client.servers.json';
import statuses from '../configs/client.statuses.json';
import languages from '../configs/client.languages.json';

interface DefaultConfig {
    main: typeof config;
    servers: typeof servers;
    statuses: typeof statuses;
    languages: typeof languages;
}

export = DefaultConfig;