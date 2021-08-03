import { MessageActionRow, MessageSelectMenuOptions, MessageSelectOptionData, SelectMenuInteraction } from "discord.js";
import { Button, FunctionButton } from "./Buttons";
import { LimitedArray5 } from './Command';
/** Common methods between different ActionRow components */
export interface ActionRow {
    readonly messageComponent: MessageActionRow;
    readonly type: string;
}
/** ActionRow component containing Buttons */
export declare class ButtonRow implements ActionRow {
    private components;
    /**
     * ActionRow component containing Buttons
     * @param components List of up to 5 Buttons
     */
    constructor(components: LimitedArray5<Button>);
    /**
     * Gets the message components to be used with messages
     * @returns A MessageActionRow with MessageButtons
     */
    get messageComponent(): MessageActionRow;
    /**
     * Returns the type of ActionRow
     * @private Intended for in-module use
     */
    get type(): string;
    /**
     * Returns a list of all FunctionButtons present in the ButtonRow, if any
     */
    get functionButtons(): FunctionButton[];
}
export interface SelectMenuRowOptions extends MessageSelectMenuOptions {
    /** Id of the SelectMenu, up to 100 characters */
    customId: string;
    /** Placeholder text to show when no option is selected */
    placeholder?: string;
    /** Selectable options for the SelectMenu */
    options: MessageSelectOptionData[];
    /** If true, no options will be selectable */
    disabled?: boolean;
    /** Minimum amount of values to be selected */
    minValues?: number;
    /** Maximum amount of values that can be selected */
    maxValues?: number;
    /** Asynchronous code to run when an option (or several) is selected */
    run: (interaction: SelectMenuInteraction) => Promise<void>;
}
/** ActionRow component containing a SelectMenu */
export declare class SelectMenuRow implements ActionRow {
    private customId;
    private placeholder?;
    private options;
    private disabled?;
    private minValues?;
    private maxValues?;
    private execute;
    /** ActionRow component containing a SelectMenu */
    constructor(options: SelectMenuRowOptions);
    /**
     * Runs code on selection
     * @param interaction Matching SelectMenuInteraction
     * @private Don't use this unless you're not using a CommandHandler
     */
    run(interaction: SelectMenuInteraction): Promise<void>;
    /** Id of the SelectMenu */
    get id(): string;
    /**
     * Gets the message components to be used with messages
     * @returns A MessageActionRow with a MessageSelectMenu
     */
    get messageComponent(): MessageActionRow;
    /**
     * Returns the type of ActionRow
     * @private Intended for in-module use
     */
    get type(): string;
}
