import { MessageActionRow, MessageSelectMenu, MessageSelectMenuOptions, MessageSelectOptionData, SelectMenuInteraction } from "discord.js"
import { Button, FunctionButton } from "./Buttons"
import { LimitedArray5 } from './Command'

/** Common methods between different ActionRow components */
export interface ActionRow {
    /** Gets the message component to be used in messages */
    readonly messageComponent: MessageActionRow,
    /** Returns the type of ActionRow */
    readonly type: "ButtonRow" | "SelectMenuRow"
}

/** ActionRow component containing Buttons */
export class ButtonRow implements ActionRow {
    /** Array of Buttons belonging to the ButtonRow */
    private components: LimitedArray5<Button>

    /**
     * ActionRow component containing Buttons
     * @param components List of up to 5 Buttons
     */
    constructor(components: LimitedArray5<Button>) {
        this.components = components
    }
    
    get messageComponent() {
        return new MessageActionRow({ components: this.components.concat().filter((b): b is Button => {
            return typeof b !== "undefined"
        }).map(b => b.messageComponent)})
    }

    get type(): "ButtonRow" {
        return "ButtonRow"
    }

    /** Returns a list of all FunctionButtons present in the ButtonRow, if any */
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
    /** List of selectable options for the SelectMenu */
    options: MessageSelectOptionData[]
    /** If true, no options will be selectable */
    disabled?: boolean
    /** Minimum amount of values to be selected */
    minValues?: number
    /** Maximum amount of values that can be selected */
    maxValues?: number
    /** Code to run when an option (or several) is selected */
    run: (interaction: SelectMenuInteraction) => Promise<void> | void
}

/** ActionRow component containing a SelectMenu */
export class SelectMenuRow implements ActionRow {
    /** Id of the SelectMenu, up to 100 characters */
    customId: string
    /** Placeholder text to show when no option is selected */
    placeholder?: string
    /** List of selectable options for the SelectMenu */
    options: MessageSelectOptionData[]
    /** If true, no options will be selectable */
    disabled?: boolean
    /** Minimum amount of options to be selected */
    minValues?: number
    /** Maximum amount of values that can be selected */
    maxValues?: number
    /** Internal function code execution variable */
    private execute: (interaction: SelectMenuInteraction) => Promise<void> | void

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
     * Runs code on option selection, used by CommandHandlers
     * @private
     */
    async run(interaction: SelectMenuInteraction) {
        try {await this.execute(interaction)}
        catch (e) {console.error(e)}
    }

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

    get type(): "SelectMenuRow" {
        return "SelectMenuRow"
    }
}