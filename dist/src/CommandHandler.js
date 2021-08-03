"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("./Command");
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * Handles user-defined commands and their components (buttons, select menus)
 *
 * All commands and components have to be registered for the handler to recognize them
 */
class CommandHandler {
    commandRegister;
    buttonRegister;
    selectMenuRegister;
    client;
    deployOptions;
    /**
     * Handles user-defined commands and their components (buttons, select menus)
     *
     * All commands and components have to be registered for the handler to recognize them
     */
    constructor(options) {
        this.commandRegister = new discord_js_1.Collection();
        this.buttonRegister = new discord_js_1.Collection();
        this.selectMenuRegister = new discord_js_1.Collection();
        this.client = options.client;
        this.deployOptions = options.deployOptions;
        if (options.commandsPath) {
            this.registerCommandsDir(path_1.resolve(options.commandsPath));
        }
        if (this.deployOptions && this.deployOptions.allowedUserIds && !this.deployOptions.deployCommand)
            this.deployOptions.deployCommand = "!deploy";
        if (this.client)
            this.listen(this.client);
    }
    /**
     * Deploys commands in a guild. If setPermsOnDeploy is true, deploying will also set command permissions.
     * @param guild Guild to deploy commands in
     */
    deployCommands(guild) {
        guild.commands.set(this.commandRegister.array().map(c => c.applicationCommand))
            .then(() => {
            console.log(`Deployed commands to guild ${guild.name}`);
            if (this.deployOptions?.setPermsOnDeploy)
                this.setPermissions(guild);
        })
            .catch(console.error);
    }
    /**
     * Recursively searches a directory for TypeScript files with a Command instance as their default export, then registers the commands and their components
     * @param dir Relative path to the command directory
     */
    async registerCommandsDir(dir) {
        fs_1.readdirSync(dir).forEach(value => {
            if (value.endsWith('.ts')) {
                const cmd = require(`${dir}/${value}`).default;
                if (cmd instanceof Command_1.Command)
                    this.registerCommand(cmd);
            }
            else
                this.registerCommandsDir(`${dir}/${value}`);
        });
    }
    /**
     * Registers a Command and all of it's components
     * @param command Command instance to be registered
     */
    registerCommand(command) {
        this.commandRegister.set(command.name, command);
        const components = command.commandComponents;
        components
            ?.filter((row) => row?.type === "ButtonRow")
            .forEach(row => row.functionButtons.forEach(b => this.registerButton(b)));
        components
            ?.filter((row) => row?.type === "SelectMenuRow")
            .forEach(menu => this.registerSelectMenu(menu));
    }
    /**
     * Gets a registered Command
     * @param commandName Command name to search for
     * @returns A Command instance (if found)
     */
    getCommand(commandName) {
        return this.commandRegister.get(commandName);
    }
    /**
     * Registers a FunctionButton
     * @param button FunctionButton instance to be registered
     */
    registerButton(button) {
        this.buttonRegister.set(button.customId, button);
    }
    /**
     * Gets a registered FunctionButton
     * @param buttonId FunctionButton customId to search for
     * @returns A FunctionButton instance (if found)
     */
    getButton(buttonId) {
        return this.buttonRegister.get(buttonId);
    }
    /**
     * Registers a SelectMenuRow
     * @param button SelectMenuRow instance to be registered
     */
    registerSelectMenu(menu) {
        this.selectMenuRegister.set(menu.id, menu);
    }
    /**
     * Gets a registered SelectMenuRow
     * @param buttonId SelectMenuRow customId to search for
     * @returns A SelectMenuRow instance (if found)
     */
    getSelectMenu(menuId) {
        return this.selectMenuRegister.get(menuId);
    }
    /**
     * Sets the permissions of all registered commands for a Guild
     * @param guild Guild to set permissions in
     */
    setPermissions(guild) {
        guild.commands.fetch().then(cmds => cmds.forEach(cmd => {
            const perms = this.commandRegister.get(cmd.name)?.permissions;
            if (perms)
                cmd.permissions.set({ permissions: perms });
        }));
    }
    listen(client) {
        client.on('messageCreate', (message) => {
            if (!this.deployOptions)
                return;
            if (message.guild && (message.author.id === this.deployOptions.allowedUserIds || this.deployOptions.allowedUserIds?.includes(message.author.id)) && message.content === this.deployOptions.deployCommand) {
                this.deployCommands(message.guild);
                message.reply({ content: "Commands deployed!" });
            }
        });
        client.on('interactionCreate', async (interaction) => {
            if (interaction.isCommand()) {
                const command = this.getCommand(interaction.commandName);
                if (command)
                    try {
                        if (command.guildOnly && !interaction.inGuild())
                            return interaction.reply({ content: "This command can only be executed within a guild!", ephemeral: true });
                        return await command.run(interaction);
                    }
                    catch (err) {
                        console.log(`Command ${command.name} failed while executing!`);
                        console.error(err);
                        return interaction.reply({ content: `Command \`${command.name}\` failed!`, ephemeral: true });
                    }
                else
                    return interaction.reply({ content: `Implementation for command \`${interaction.commandName}\` is missing!`, ephemeral: true });
            }
            else if (interaction.isButton()) {
                const button = this.getButton(interaction.customId);
                if (button)
                    try {
                        return await button.run(interaction);
                    }
                    catch (err) {
                        console.log(`Button ${button.customId} failed while executing!`);
                        console.error(err);
                        return interaction.reply({ content: `Button \`${button.customId}\` failed!`, ephemeral: true });
                    }
                else
                    return interaction.reply({ content: `Implementation for button \`${interaction.customId}\` is missing!`, ephemeral: true });
            }
            else if (interaction.isSelectMenu()) {
                const menu = this.getSelectMenu(interaction.customId);
                if (menu)
                    try {
                        return await menu.run(interaction);
                    }
                    catch (err) {
                        console.log(`Select menu ${menu.id} failed while executing!`);
                        console.error(err);
                        return interaction.reply({ content: `Select menu \`${menu.id}\` failed!`, ephemeral: true });
                    }
                else
                    return interaction.reply({ content: `Implementation for select menu \`${interaction.customId}\` is missing!`, ephemeral: true });
            }
        });
    }
}
exports.default = CommandHandler;
