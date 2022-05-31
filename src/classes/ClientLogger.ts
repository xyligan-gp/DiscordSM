export default class ClientLogger {
    public log(message: string): void {
        return console.log(`[Discord SM]: ${message}`);
    }

    public error(message: string): void {
        return console.error(`[Discord SM Error]: ${message}`);
    }
}