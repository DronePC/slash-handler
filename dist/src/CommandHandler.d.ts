import { Client, Guild } from "discord.js";
import { FunctionButton } from "./Buttons";
import { Command } from "./Command";
import { SelectMenuRow } from "./ActionRow";
export interface CommandHandlerOptions {
    /** Client instance for interaction events */
    client: Client;
    /** Options for deploying commands in a guild */
    deployOptions?: CommandHandlerDeployOptions;
    /**
     * Path to directory from which commands will be registered
     *
     * The directory will be recursively searched for TypeScript files with a Command instance as their default export
     */
    commandsPath?: string;
}
export interface CommandHandlerDeployOptions {
    /** User Id(s) which specify who can use the deploy command */
    allowedUserIds?: `${bigint}` | `${bigint}`[];
    /** Message command used in a guild to deploy guild commands. Defaults to "!deploy" */
    deployCommand?: string;
    /** If set to true, deploying will set command permissions. */
    setPermsOnDeploy?: boolean;
}
/**
 * Handles user-defined commands and their components (buttons, select menus)
 *
 * All commands and components have to be registered for the handler to recognize them
 */
export default class CommandHandler {
    private commandRegister;
    private buttonRegister;
    private selectMenuRegister;
    private client;
    private deployOptions?;
    /**
     * Handles user-defined commands and their components (buttons, select menus)
     *
     * All commands and components have to be registered for the handler to recognize them
     */
    constructor(options: CommandHandlerOptions);
    /**
     * Deploys commands in a guild. If setPermsOnDeploy is true, deploying will also set command permissions.
     * @param guild Guild to deploy commands in
     */
    deployCommands(guild: Guild): void;
    /**
     * Recursively searches a directory for TypeScript files with a Command instance as their default export, then registers the commands and their components
     * @param dir Relative path to the command directory
     */
    registerCommandsDir(dir: string): Promise<void>;
    /**
     * Registers a Command and all of it's components
     * @param command Command instance to be registered
     */
    registerCommand(command: Command): void;
    /**
     * Gets a registered Command
     * @param commandName Command name to search for
     * @returns A Command instance (if found)
     */
    getCommand(commandName: string): Command<false> | undefined;
    /**
     * Registers a FunctionButton
     * @param button FunctionButton instance to be registered
     */
    registerButton(button: FunctionButton): void;
    /**
     * Gets a registered FunctionButton
     * @param buttonId FunctionButton customId to search for
     * @returns A FunctionButton instance (if found)
     */
    getButton(buttonId: string): FunctionButton | undefined;
    /**
     * Registers a SelectMenuRow
     * @param button SelectMenuRow instance to be registered
     */
    registerSelectMenu(menu: SelectMenuRow): void;
    /**
     * Gets a registered SelectMenuRow
     * @param buttonId SelectMenuRow customId to search for
     * @returns A SelectMenuRow instance (if found)
     */
    getSelectMenu(menuId: string): SelectMenuRow | undefined;
    /**
     * Sets the permissions of all registered commands for a Guild
     * @param guild Guild to set permissions in
     */
    setPermissions(guild: Guild): void;
    private listen;
}
