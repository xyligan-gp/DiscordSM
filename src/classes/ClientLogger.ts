class ClientLogger {
    constructor() {}

    public log(message: string): void {
        return console.log(`[Discord SM]: ${message}`);
    }

    public error(message: string): void {
        return console.error(`[Discord SM Error]: ${message}`);
    }
}

export = ClientLogger;