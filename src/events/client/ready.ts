import ClientEvent from '../../intefaces/ClientEvent';

export = {
    run(client) {
        client.utils.initialStatuses();
        client.utils.registerCommands();
        
        return client.logger.log(`${client.user.tag} ready!`);
    }
} as ClientEvent;