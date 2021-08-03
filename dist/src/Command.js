"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandGroup = exports.Command = void 0;
/**
 * Represents a slash command with executable code, can also represent a sub-command to a CommandGroup
 *
 * Can hold other components (buttons, select menus)
 */
class Command {
    /** Name of the command */
    name;
    /** Description of the command */
    description;
    /** Options of the command. Cannot hold sub-commands, for that use CommandGroups */
    options;
    /** Guild only flag of the command. Will be inherited from a CommandGroup */
    guildOnly;
    /** Default permission of the command. If set to false, no-one can use the command by default. Will be inherited from a CommandGroup */
    defaultPermission;
    /** Per-guild permissions of the command. Have to be set to every guild manually. Will be inherited from a CommandGroup */
    permissions;
    /** Components of the command */
    components;
    execute;
    /**
     * Represents a slash command with executable code
     *
     * Can hold other components (buttons, select menus)
     *
     * Has to be registered to a CommandHandler to function properly
     */
    constructor(options) {
        this.name = options.name.toLowerCase();
        this.description = options.description;
        this.guildOnly = options.guildOnly;
        this.options = options.options?.filter((o) => {
            if (o !== undefined)
                return true;
            else
                return false;
        });
        this.defaultPermission = options.defaultPermission;
        this.permissions = options.permissions;
        this.components = options.components;
        this.execute = options.run;
    }
    /**
     * Gets the message components to be used with messages
     * @returns List of MessageActionRows, or an empty list if no components are present
     */
    get messageComponents() {
        return this.components?.concat().filter((c) => { return c !== undefined; }).map(row => row?.messageComponent) || [];
    }
    /**
     * Gets the command components with executable code
     * @returns List of ActionRows, or an empty list if no components are present
     */
    get commandComponents() {
        return this.components?.concat().filter((c) => { return c !== undefined; }) || [];
    }
    /** Gets the application command data to be deployed as slash commands */
    get applicationCommand() {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            defaultPermission: this.defaultPermission,
        };
    }
    /**
     * Runs the command
     * @param interaction Matching CommandInteraction
     * @private Don't use this unless you're not using a CommandHandler
     */
    async run(interaction) {
        try {
            this.execute(interaction);
        }
        catch (e) {
            console.error(e);
        }
    }
}
exports.Command = Command;
/** Represents a slash command with sub-commands, or a sub-command group, can run code */
class CommandGroup extends Command {
    /** Group of sub-commands and sub-command groups. Nested CommandGroups cannot hold more CommandGroups */
    group;
    /** Represents a slash command with sub-commands, or a sub-command group, can run code */
    constructor(options) {
        super({ name: options.name, description: options.description, run: options.run || (async () => { }), defaultPermission: options.defaultPermission, permissions: options.permissions });
        this.group = options.group;
    }
    get commandComponents() {
        const components = [];
        this.group.forEach(g => {
            if (g === undefined)
                return;
            else
                components.push(...g.commandComponents.concat().filter((r) => {
                    return typeof r !== "undefined";
                }));
        });
        return components;
    }
    get applicationCommand() {
        const options = [];
        this.group.forEach(g => {
            if (g === undefined)
                return;
            const group = {
                type: "SUB_COMMAND",
                name: g.name,
                description: g.description,
                options: []
            };
            if (g instanceof CommandGroup) {
                group.type = "SUB_COMMAND_GROUP";
                g.group.forEach(c => {
                    if (c === undefined)
                        return;
                    group.options?.push({
                        type: "SUB_COMMAND",
                        name: c.name,
                        description: c.description,
                        options: c.options
                    });
                });
            }
            else {
                group.options = g.options;
            }
            options.push(group);
        });
        return {
            name: this.name,
            description: this.description,
            defaultPermission: this.defaultPermission,
            options: options
        };
    }
    /**
     * Runs the CommandGroup code, code is ran before nested commands
     * @param interaction Matching CommandInteraction
     * @private Don't use this unless you're not using a CommandHandler
     */
    async run(interaction) {
        try {
            this.execute?.(interaction);
            if (interaction.options.getSubcommandGroup(false) === this.name) {
                this.group.find(g => g?.name === interaction.options.getSubcommand(false))?.run(interaction);
            }
            else {
                this.group.find(g => g?.name === interaction.options.getSubcommandGroup(false))?.run(interaction);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
}
exports.CommandGroup = CommandGroup;
