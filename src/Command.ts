import { ApplicationCommandData, ApplicationCommandOptionData, ApplicationCommandPermissionData, CommandInteraction } from "discord.js"
import { ActionRow } from "./ActionRow"

export type LimitedArray25<T> = readonly [T, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T?, T? ,T?, T?, T?, T?]
export type LimitedArray5<T>  = readonly [T, T?, T?, T?, T?]

export interface CommandOptions<InGroup extends boolean> {
    /** Name and id of the command */
    name: string
    /** Description of the command */
    description: string
    /** Options of the command. Cannot hold sub-commands, for that use CommandGroups */
    options?: LimitedArray25<(ApplicationCommandOptionData & { type: "STRING" | "INTEGER" | "BOOLEAN" | "USER" | "CHANNEL" | "ROLE" | "MENTIONABLE" | "NUMBER" })>
    /** If true, the command will only execute within a Guild. Will be inherited from a CommandGroup */
    guildOnly?: InGroup extends false ? boolean : undefined
    /** User and Role specific permissions. Will be inherited from a CommandGroup */
    permissions?: InGroup extends false ? ApplicationCommandPermissionData[] : undefined
    /** If set to false, no-one can use the command unless they have explicit permissions. Will be inherited from a CommandGroup */
    defaultPermission?: InGroup extends false ? boolean : undefined
    /** Command components (ButtonRows or SelectMenuRows) */
    components?: LimitedArray5<ActionRow>
    /** Asynchronous code to run when receiving a CommandInteraction */
    run: (interaction: CommandInteraction) => Promise<void>
}

export interface CommandGroupOptions<InGroup extends boolean> extends Omit<CommandOptions<InGroup>, "run" | "options"> {
    /** Asynchronous code to run when receiving a CommandInteraction */
    run?: (interaction: CommandInteraction) => Promise<void>
    /** Group of sub-commands and sub-command groups. Nested CommandGroups cannot hold more CommandGroups */
    group: InGroup extends false ? LimitedArray25<CommandGroup<true> | Command<true>> : LimitedArray25<Command<true>>
}

/**
 * Represents a slash command with executable code, can also represent a sub-command to a CommandGroup
 * 
 * Can hold other components (buttons, select menus)
 */
export class Command<InGroup extends boolean = false> {
    /** Name of the command */
    name: string
    /** Description of the command */
    description: string
    /** Options of the command. Cannot hold sub-commands, for that use CommandGroups */
    options?: ApplicationCommandOptionData[]
    /** Guild only flag of the command. Will be inherited from a CommandGroup */
    guildOnly?: InGroup extends false ? boolean : undefined
    /** Default permission of the command. If set to false, no-one can use the command by default. Will be inherited from a CommandGroup */
    defaultPermission?: InGroup extends false ? boolean : undefined
    /** Per-guild permissions of the command. Have to be set to every guild manually. Will be inherited from a CommandGroup */
    permissions?: InGroup extends false ? ApplicationCommandPermissionData[] : undefined
    /** Components of the command */
    private components?: LimitedArray5<ActionRow>
    protected execute: (interaction: CommandInteraction) => Promise<void>

    /**
     * Represents a slash command with executable code
     * 
     * Can hold other components (buttons, select menus)
     * 
     * Has to be registered to a CommandHandler to function properly
     */
    constructor(options: CommandOptions<InGroup>) {
        this.name = options.name.toLowerCase()
        this.description = options.description
        this.guildOnly = options.guildOnly
        this.options = options.options?.filter((o): o is ApplicationCommandOptionData & { type: "STRING" | "INTEGER" | "BOOLEAN" | "USER" | "CHANNEL" | "ROLE" | "MENTIONABLE" | "NUMBER" } => {
            if (o !== undefined) return true; else return false
        })
        this.defaultPermission = options.defaultPermission
        this.permissions = options.permissions
        this.components = options.components
        this.execute = options.run
    }

    /** 
     * Gets the message components to be used with messages
     * @returns List of MessageActionRows, or an empty list if no components are present
     */
    get messageComponents() {
        return this.components?.concat().filter((c): c is ActionRow => {return c !== undefined}).map(row => row?.messageComponent) || []
    }

    /** 
     * Gets the command components with executable code
     * @returns List of ActionRows, or an empty list if no components are present
     */
    get commandComponents() {
        return this.components?.concat().filter((c): c is ActionRow => {return c !== undefined}) || []
    }

    /** Gets the application command data to be deployed as slash commands */
    get applicationCommand(): ApplicationCommandData {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            defaultPermission: this.defaultPermission,
        }
    }

    /**
     * Runs the command
     * @param interaction Matching CommandInteraction
     * @private Don't use this unless you're not using a CommandHandler
     */
    async run(interaction: CommandInteraction) {
        try {this.execute(interaction)} 
        catch (e) {console.error(e)}
    }
}

/** Represents a slash command with sub-commands, or a sub-command group, can run code */
export class CommandGroup<InGroup extends boolean = false> extends Command {
    /** Group of sub-commands and sub-command groups. Nested CommandGroups cannot hold more CommandGroups */
    private group: InGroup extends false ? LimitedArray25<CommandGroup<true> | Command<true>> : LimitedArray25<Command<true>>

    /** Represents a slash command with sub-commands, or a sub-command group, can run code */
    constructor(options: CommandGroupOptions<InGroup>) {
        super({ name: options.name, description: options.description, run: options.run || (async () => {}), defaultPermission: options.defaultPermission, permissions: options.permissions })
        this.group = options.group
    }

    override get commandComponents() {
        const components: ActionRow[] = []
        this.group.forEach(g => {
            if (g === undefined) return
            else components.push(...g.commandComponents.concat().filter((r): r is ActionRow => {
                return typeof r !== "undefined"
            }))
        })
        return components
    }

    override get applicationCommand(): ApplicationCommandData {
        const options: ApplicationCommandOptionData[] = []
        this.group.forEach(g => {
            if (g === undefined) return
            const group: ApplicationCommandOptionData = {
                type: "SUB_COMMAND",
                name: g.name,
                description: g.description,
                options: []
            }
            if (g instanceof CommandGroup) {
                group.type = "SUB_COMMAND_GROUP"
                g.group.forEach(c => {
                    if (c === undefined) return
                    group.options?.push({
                        type: "SUB_COMMAND",
                        name: c.name,
                        description: c.description,
                        options: c.options
                    })
                })
            } else {
                group.options = g.options
            }
            options.push(group)
        })
        return {
            name: this.name,
            description: this.description,
            defaultPermission: this.defaultPermission,
            options: options
        }
    }

    /**
     * Runs the CommandGroup code, code is ran before nested commands
     * @param interaction Matching CommandInteraction
     * @private Don't use this unless you're not using a CommandHandler
     */
    override async run(interaction: CommandInteraction) {
        try {
            this.execute?.(interaction)
            if (interaction.options.getSubcommandGroup(false) === this.name) {
                this.group.find(g => g?.name === interaction.options.getSubcommand(false))?.run(interaction)
            } else {
                this.group.find(g => g?.name === interaction.options.getSubcommandGroup(false))?.run(interaction)
            }
        } catch (e) {console.error(e)}
    }
}