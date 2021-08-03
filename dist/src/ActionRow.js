"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectMenuRow = exports.ButtonRow = void 0;
const discord_js_1 = require("discord.js");
const Buttons_1 = require("./Buttons");
/** ActionRow component containing Buttons */
class ButtonRow {
    components;
    /**
     * ActionRow component containing Buttons
     * @param components List of up to 5 Buttons
     */
    constructor(components) {
        this.components = components;
    }
    /**
     * Gets the message components to be used with messages
     * @returns A MessageActionRow with MessageButtons
     */
    get messageComponent() {
        return new discord_js_1.MessageActionRow({ components: this.components.concat().filter((b) => {
                return typeof b !== "undefined";
            }).map(b => b.messageComponent) });
    }
    /**
     * Returns the type of ActionRow
     * @private Intended for in-module use
     */
    get type() {
        return "ButtonRow";
    }
    /**
     * Returns a list of all FunctionButtons present in the ButtonRow, if any
     */
    get functionButtons() {
        return this.components.filter((b) => {
            return b instanceof Buttons_1.FunctionButton;
        });
    }
}
exports.ButtonRow = ButtonRow;
/** ActionRow component containing a SelectMenu */
class SelectMenuRow {
    customId;
    placeholder;
    options;
    disabled;
    minValues;
    maxValues;
    execute;
    /** ActionRow component containing a SelectMenu */
    constructor(options) {
        this.customId = options.customId.toLowerCase();
        this.placeholder = options.placeholder;
        this.options = options.options;
        this.disabled = options.disabled;
        this.minValues = options.minValues;
        this.maxValues = options.maxValues;
        this.execute = options.run;
    }
    /**
     * Runs code on selection
     * @param interaction Matching SelectMenuInteraction
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
    /** Id of the SelectMenu */
    get id() {
        return this.customId;
    }
    /**
     * Gets the message components to be used with messages
     * @returns A MessageActionRow with a MessageSelectMenu
     */
    get messageComponent() {
        return new discord_js_1.MessageActionRow({ components: [new discord_js_1.MessageSelectMenu({
                    customId: this.customId,
                    placeholder: this.placeholder,
                    options: this.options,
                    disabled: this.disabled,
                    minValues: this.minValues,
                    maxValues: this.maxValues
                })] });
    }
    /**
     * Returns the type of ActionRow
     * @private Intended for in-module use
     */
    get type() {
        return "SelectMenuRow";
    }
}
exports.SelectMenuRow = SelectMenuRow;
