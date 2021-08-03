"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkButton = exports.DisabledButton = exports.FunctionButton = exports.Button = void 0;
const discord_js_1 = require("discord.js");
/**
 * Base button component class
 * @private Use the extended functionality button classes
 */
class Button {
    style;
    customId;
    disabled;
    emoji;
    label;
    url;
    constructor(options) {
        this.style = options.style;
        this.customId = options.customId?.toLowerCase();
        this.disabled = options.disabled;
        this.emoji = options.emoji;
        this.label = options.label;
        this.url = options.url;
    }
    /**
     * Gets the message components to be used with messages
     * @returns A MessageButton
     */
    get messageComponent() {
        return new discord_js_1.MessageButton(this);
    }
}
exports.Button = Button;
/** Button that executes code when clicked */
class FunctionButton extends Button {
    customId;
    execute;
    /** Button that executes code when clicked */
    constructor(options) {
        super(options);
        this.customId = options.customId.toLowerCase();
        this.label = options.label;
        this.execute = options.run;
    }
    /**
     * Runs code on click
     * @param interaction Matching ButtonInteraction
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
exports.FunctionButton = FunctionButton;
/** Button that cannot be clicked */
class DisabledButton extends Button {
    /** Button that cannot be clicked */
    constructor(options) {
        super(options);
        this.disabled = true;
        if (this.style === "LINK")
            this.url = "https://example.com";
        else
            this.customId = "_";
    }
}
exports.DisabledButton = DisabledButton;
/** Button that leads to a URL when clicked */
class LinkButton extends Button {
    url;
    /** Button that leads to a URL when clicked */
    constructor(options) {
        super({ style: "LINK", label: options.label, emoji: options.emoji || "" });
        this.url = options.url;
    }
}
exports.LinkButton = LinkButton;
