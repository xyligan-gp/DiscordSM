export default interface ClientSubCommand {
    group: string | null;
    name: string | null;
    options: Array<string> | null;
}