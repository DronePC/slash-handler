import { ButtonInteraction, EmojiIdentifierResolvable, MessageButton, MessageButtonOptions, MessageButtonStyleResolvable } from "discord.js"

export interface ButtonOptions extends MessageButtonOptions {
    /** Defines a button's color and function */
    style: MessageButtonStyleResolvable
    /** Text that shows up on a button */
    label?: string
    /** Emoji that shows up on a button */
    emoji?: EmojiIdentifierResolvable
    /** Id of the button, up to 100 characters */
    customId?: string
    /** URL of a button. Can only be used with a LINK style button, and cannot be combined with an Id */
    url?: string
    /** If set to true, the button will not be clickable */
    disabled?: boolean
}

export interface ButtonOptionsLabel extends ButtonOptions {
    label: string
}

export interface ButtonOptionsEmoji extends ButtonOptions {
    emoji: EmojiIdentifierResolvable
}

export interface FunctionButtonOptions extends ButtonOptions {
    style: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER"
    customId: string
    label?: string
    emoji?: EmojiIdentifierResolvable
    run: (interaction: ButtonInteraction) => Promise<void>
}

export interface FunctionButtonOptionsLabel extends FunctionButtonOptions {
    label: string
}

export interface FunctionButtonOptionsEmoji extends FunctionButtonOptions {
    emoji: EmojiIdentifierResolvable
}

export interface DisabledButtonOptions extends ButtonOptions {
    style: MessageButtonStyleResolvable
    label?: string
    emoji?: EmojiIdentifierResolvable
}

export interface DisabledButtonOptionsLabel extends DisabledButtonOptions {
    label: string
}

export interface DisabledButtonOptionsEmoji extends DisabledButtonOptions {
    emoji: EmojiIdentifierResolvable
}

export interface LinkButtonOptions extends ButtonOptions {
    url: string
    label?: string
    emoji?: EmojiIdentifierResolvable
}

export interface LinkButtonOptionsLabel extends LinkButtonOptions {
    label: string
}

export interface LinkButtonOptionsEmoji extends LinkButtonOptions {
    emoji: EmojiIdentifierResolvable
}

/**
 * Base button component class
 * @private Use the extended functionality button classes
 */
export class Button implements ButtonOptions {
    style: MessageButtonStyleResolvable
    customId?: string
    disabled?: boolean
    emoji?: EmojiIdentifierResolvable
    label?: string
    url?: string

    constructor(options: ButtonOptionsLabel | ButtonOptionsEmoji) {
        this.style = options.style
        this.customId = options.customId?.toLowerCase()
        this.disabled = options.disabled
        this.emoji = options.emoji
        this.label = options.label
        this.url = options.url
    }

    /** 
     * Gets the message components to be used with messages
     * @returns A MessageButton
     */
    get messageComponent(): MessageButton {
        return new MessageButton(this)
    }
}

/** Button that executes code when clicked */
export class FunctionButton extends Button {
    override customId: string
    private execute: (interaction: ButtonInteraction) => Promise<void>
    
    /** Button that executes code when clicked */
    constructor(options: FunctionButtonOptionsLabel | FunctionButtonOptionsEmoji) {
        super(options)
        this.customId = options.customId.toLowerCase()
        this.label = options.label
        this.execute = options.run
    }

    /**
     * Runs code on click
     * @param interaction Matching ButtonInteraction
     * @private Don't use this unless you're not using a CommandHandler
     */
    async run(interaction: ButtonInteraction) {
        try {this.execute(interaction)} 
        catch (e) {console.error(e)}
    }
}

/** Button that cannot be clicked */
export class DisabledButton extends Button {
    /** Button that cannot be clicked */
    constructor(options: DisabledButtonOptionsLabel | DisabledButtonOptionsEmoji) {
        super(options)
        this.disabled = true
        if (this.style === "LINK") this.url = "https://example.com"; else this.customId = "_"
    }
}

/** Button that leads to a URL when clicked */
export class LinkButton extends Button {
    override url: string

    /** Button that leads to a URL when clicked */
    constructor(options: LinkButtonOptionsLabel | LinkButtonOptionsEmoji) {
        super({ style: "LINK", label: options.label, emoji: options.emoji || "" })
        this.url = options.url
    }
}