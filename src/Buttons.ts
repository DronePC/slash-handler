import { ButtonInteraction, EmojiIdentifierResolvable, InteractionButtonOptions, MessageButton, MessageButtonStyleResolvable, LinkButtonOptions as ButtonLinkOptions } from "discord.js"

export interface FunctionButtonOptions extends InteractionButtonOptions {
    /** Defines a button's color and function */
    style: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER"
    /** Id of the button, up to 100 characters */
    customId: string
    /** Text that shows up on a button */
    label?: string
    /** Emoji that shows up on a button */
    emoji?: EmojiIdentifierResolvable
    /** Code to run when the button is pressed */
    run: (interaction: ButtonInteraction) => Promise<void> | void
}

export interface FunctionButtonOptionsLabel extends FunctionButtonOptions {
    label: string
}

export interface FunctionButtonOptionsEmoji extends FunctionButtonOptions {
    emoji: EmojiIdentifierResolvable
}

export interface DisabledButtonOptions {
    /** Defines a button's color and function */
    style: MessageButtonStyleResolvable
    /** Text that shows up on a button */
    label?: string
    /** Emoji that shows up on a button */
    emoji?: EmojiIdentifierResolvable
}

export interface DisabledButtonOptionsLabel extends DisabledButtonOptions {
    label: string
}

export interface DisabledButtonOptionsEmoji extends DisabledButtonOptions {
    emoji: EmojiIdentifierResolvable
}

export interface LinkButtonOptions {
    /** URL of a link button. */
    url: string
    /** Text that shows up on a button */
    label?: string
    /** Emoji that shows up on a button */
    emoji?: EmojiIdentifierResolvable
}

export interface LinkButtonOptionsLabel extends LinkButtonOptions {
    label: string
}

export interface LinkButtonOptionsEmoji extends LinkButtonOptions {
    emoji: EmojiIdentifierResolvable
}

/** Common methods between different Button components */
export interface Button {
    /** Defines a button's color and function */
    style: MessageButtonStyleResolvable
    /** Text that shows up on a button */
    label?: string
    /** Emoji that shows up on a button */
    emoji?: EmojiIdentifierResolvable
    /** Id of the button, up to 100 characters */
    customId?: string
    /** URL of a link button. */
    url?: string
    /** If set to true, the button will not be clickable */
    disabled?: boolean
    /** Gets the message component to be used in messages */
    get messageComponent(): MessageButton
}

/** Button that executes code when clicked */
export class FunctionButton implements Button {
    style: "PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER"
    label?: string
    emoji?: EmojiIdentifierResolvable
    customId: string
    /** Internal function code execution variable */
    private execute: (interaction: ButtonInteraction) => Promise<void> | void
    
    /** Button that executes code when clicked */
    constructor(options: FunctionButtonOptionsLabel | FunctionButtonOptionsEmoji) {
        this.style = options.style
        this.customId = options.customId.toLowerCase()
        this.label = options.label
        this.emoji = options.emoji
        this.execute = options.run
    }

    /**
     * Runs code on button press, used by CommandHandlers
     * @private
     */
    async run(interaction: ButtonInteraction) {
        try {await this.execute(interaction)} 
        catch (e) {console.error(e)}
    }

    get messageComponent() {
        return new MessageButton(this)
    }
}

/** Button that cannot be clicked */
export class DisabledButton implements Button {
    style: MessageButtonStyleResolvable
    disabled: boolean
    label?: string
    emoji?: EmojiIdentifierResolvable
    customId?: string
    url?: string

    /** Button that cannot be clicked */
    constructor(options: DisabledButtonOptionsLabel | DisabledButtonOptionsEmoji) {
        this.style = options.style
        this.disabled = true
        if (this.style === "LINK") this.url = "https://example.com"; else this.customId = "_"
    }

    get messageComponent() {
        return new MessageButton(this as ButtonLinkOptions | InteractionButtonOptions)
    }
}

/** Button that leads to a URL when clicked */
export class LinkButton implements Button {
    style: "LINK"
    url: string
    label?: string
    emoji?: EmojiIdentifierResolvable

    /** Button that leads to a URL when clicked */
    constructor(options: LinkButtonOptionsLabel | LinkButtonOptionsEmoji) {
        this.style = "LINK"
        this.url = options.url
        this.label = options.label
        this.emoji = options.emoji
    }

    get messageComponent() {
        return new MessageButton(this)
    }
}