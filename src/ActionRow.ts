import { MessageActionRow, MessageSelectMenu, MessageSelectMenuOptions, MessageSelectOptionData, SelectMenuInteraction } from "discord.js"
import { Button, FunctionButton } from "./Buttons"
import { LimitedArray5 } from './Command'

/** Common methods between different ActionRow components */
export interface ActionRow {
    readonly messageComponent: MessageActionRow,
    readonly type: string
}

/** ActionRow component containing Buttons */
export class ButtonRow implements ActionRow {
    private components: LimitedArray5<Button>

    /**
     * ActionRow component containing Buttons
     * @param components List of up to 5 Buttons
     */
    constructor(components: LimitedArray5<Button>) {
        this.components = components
    }

    /** 
     * Gets the message components to be used with messages
     * @returns A MessageActionRow with MessageButtons
     */
    get messageComponent() {
        return new MessageActionRow({ components: this.components.concat().filter((b): b is Button => {
            return typeof b !== "undefined"
        }).map(b => b.messageComponent)})
    }

    /**
     * Returns the type of ActionRow
     * @private Intended for in-module use
     */
    get type() {
        return "ButtonRow"
    }

    /**
     * Returns a list of all FunctionButtons present in the ButtonRow, if any
     */
    get functionButtons() {
        return this.components.filter((b): b is FunctionButton => {
            return b instanceof FunctionButton
        })
    }
}

export interface SelectMenuRowOptions extends MessageSelectMenuOptions {
    /** Id of the SelectMenu, up to 100 characters */
    customId: string;
    /** Placeholder text to show when no option is selected */
    placeholder?: string
    /** Selectable options for the SelectMenu */
    options: MessageSelectOptionData[]
    /** If true, no options will be selectable */
    disabled?: boolean
    /** Minimum amount of values to be selected */
    minValues?: number
    /** Maximum amount of values that can be selected */
    maxValues?: number
    /** Asynchronous code to run when an option (or several) is selected */
    run: (interaction: SelectMenuInteraction) => Promise<void>
}

/** ActionRow component containing a SelectMenu */
export class SelectMenuRow implements ActionRow {
    private customId: string
    private placeholder?: string
    private options: MessageSelectOptionData[]
    private disabled?: boolean
    private minValues?: number
    private maxValues?: number
    private execute: (interaction: SelectMenuInteraction) => Promise<void>

    /** ActionRow component containing a SelectMenu */
    constructor(options: SelectMenuRowOptions) {
        this.customId = options.customId.toLowerCase()
        this.placeholder = options.placeholder
        this.options = options.options
        this.disabled = options.disabled
        this.minValues = options.minValues
        this.maxValues = options.maxValues
        this.execute = options.run
    }

    /**
     * Runs code on selection
     * @param interaction Matching SelectMenuInteraction
     * @private Don't use this unless you're not using a CommandHandler
     */
    async run(interaction: SelectMenuInteraction) {
        try {this.execute(interaction)}
        catch (e) {console.error(e)}
    }

    /** Id of the SelectMenu */
    get id() {
        return this.customId
    }

    /** 
     * Gets the message components to be used with messages
     * @returns A MessageActionRow with a MessageSelectMenu
     */
    get messageComponent() {
        return new MessageActionRow({ components: [new MessageSelectMenu({
            customId: this.customId,
            placeholder: this.placeholder,
            options: this.options,
            disabled: this.disabled,
            minValues: this.minValues,
            maxValues: this.maxValues
        })] })
    }

    /**
     * Returns the type of ActionRow
     * @private Intended for in-module use
     */
    get type() {
        return "SelectMenuRow"
    }
}