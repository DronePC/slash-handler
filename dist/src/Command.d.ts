import { ApplicationCommandData, ApplicationCommandOptionData, ApplicationCommandPermissionData, CommandInteraction } from "discord.js";
import { ActionRow } from "./ActionRow";
export declare type LimitedArray25<T> = readonly [T, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?];
export declare type LimitedArray5<T> = readonly [T, T?, T?, T?, T?];
export interface CommandOptions<InGroup extends boolean> {
    /** Name and id of the command */
    name: string;
    /** Description of the command */
    description: string;
    /** Options of the command. Cannot hold sub-commands, for that use CommandGroups */
    options?: LimitedArray25<(ApplicationCommandOptionData & {
        type: "STRING" | "INTEGER" | "BOOLEAN" | "USER" | "CHANNEL" | "ROLE" | "MENTIONABLE" | "NUMBER";
    })>;
    /** If true, the command will only execute within a Guild. Will be inherited from a CommandGroup */
    guildOnly?: InGroup extends false ? boolean : undefined;
    /** User and Role specific permissions. Will be inherited from a CommandGroup */
    permissions?: InGroup extends false ? ApplicationCommandPermissionData[] : undefined;
    /** If set to false, no-one can use the command unless they have explicit permissions. Will be inherited from a CommandGroup */
    defaultPermission?: InGroup extends false ? boolean : undefined;
    /** Command components (ButtonRows or SelectMenuRows) */
    components?: LimitedArray5<ActionRow>;
    /** Asynchronous code to run when receiving a CommandInteraction */
    run: (interaction: CommandInteraction) => Promise<void>;
}
export interface CommandGroupOptions<InGroup extends boolean> extends Omit<CommandOptions<InGroup>, "run" | "options"> {
    /** Asynchronous code to run when receiving a CommandInteraction */
    run?: (interaction: CommandInteraction) => Promise<void>;
    /** Group of sub-commands and sub-command groups. Nested CommandGroups cannot hold more CommandGroups */
    group: InGroup extends false ? LimitedArray25<CommandGroup<true> | Command<true>> : LimitedArray25<Command<true>>;
}
/**
 * Represents a slash command with executable code, can also represent a sub-command to a CommandGroup
 *
 * Can hold other components (buttons, select menus)
 */
export declare class Command<InGroup extends boolean = false> {
    /** Name of the command */
    name: string;
    /** Description of the command */
    description: string;
    /** Options of the command. Cannot hold sub-commands, for that use CommandGroups */
    options?: ApplicationCommandOptionData[];
    /** Guild only flag of the command. Will be inherited from a CommandGroup */
    guildOnly?: InGroup extends false ? boolean : undefined;
    /** Default permission of the command. If set to false, no-one can use the command by default. Will be inherited from a CommandGroup */
    defaultPermission?: InGroup extends false ? boolean : undefined;
    /** Per-guild permissions of the command. Have to be set to every guild manually. Will be inherited from a CommandGroup */
    permissions?: InGroup extends false ? ApplicationCommandPermissionData[] : undefined;
    /** Components of the command */
    private components?;
    protected execute: (interaction: CommandInteraction) => Promise<void>;
    /**
     * Represents a slash command with executable code
     *
     * Can hold other components (buttons, select menus)
     *
     * Has to be registered to a CommandHandler to function properly
     */
    constructor(options: CommandOptions<InGroup>);
    /**
     * Gets the message components to be used with messages
     * @returns List of MessageActionRows, or an empty list if no components are present
     */
    get messageComponents(): import("discord.js").MessageActionRow[];
    /**
     * Gets the command components with executable code
     * @returns List of ActionRows, or an empty list if no components are present
     */
    get commandComponents(): ActionRow[];
    /** Gets the application command data to be deployed as slash commands */
    get applicationCommand(): ApplicationCommandData;
    /**
     * Runs the command
     * @param interaction Matching CommandInteraction
     * @private Don't use this unless you're not using a CommandHandler
     */
    run(interaction: CommandInteraction): Promise<void>;
}
/** Represents a slash command with sub-commands, or a sub-command group, can run code */
export declare class CommandGroup<InGroup extends boolean = false> extends Command {
    /** Group of sub-commands and sub-command groups. Nested CommandGroups cannot hold more CommandGroups */
    private group;
    /** Represents a slash command with sub-commands, or a sub-command group, can run code */
    constructor(options: CommandGroupOptions<InGroup>);
    get commandComponents(): ActionRow[];
    get applicationCommand(): ApplicationCommandData;
    /**
     * Runs the CommandGroup code, code is ran before nested commands
     * @param interaction Matching CommandInteraction
     * @private Don't use this unless you're not using a CommandHandler
     */
    run(interaction: CommandInteraction): Promise<void>;
}
