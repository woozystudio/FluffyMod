import { ChatInputCommandInteraction } from "discord.js";
import { CommandPayload } from "../types/Command.js";

export abstract class Command<C extends CommandPayload> {
	public readonly name: string;
	public readonly description: string;

	public readonly testMode: boolean = true; // Default to true, can be overridden in subclasses

	protected constructor(payload: C) {
		this.name = payload.name;
		this.description = payload.description;
	}

	public abstract chatInput(interaction: ChatInputCommandInteraction): Promise<void> | void;
}
