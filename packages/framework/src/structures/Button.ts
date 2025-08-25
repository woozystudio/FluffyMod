import { ButtonInteraction } from "discord.js";
import { ButtonPayload } from "../types/Components.js";
import { ModerationClient } from "./ModerationClient.js";

export abstract class Button<C extends ButtonPayload> {
	public readonly customId: string;
	public readonly description?: string;

	protected constructor(payload: C) {
		this.customId = payload.customId;
		this.description = payload.description;
	}

	public abstract execute(interaction: ButtonInteraction, client?: ModerationClient): void;
}
