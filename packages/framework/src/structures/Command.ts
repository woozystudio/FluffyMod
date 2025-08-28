import { ApplicationCommandOptionData, ChatInputCommandInteraction } from "discord.js";
import { CommandPayload } from "../types/Command.js";
import { ModerationClient } from "./ModerationClient.js";

export abstract class Command<C extends CommandPayload> {
	public readonly name: string;
	public readonly description: string;
	public readonly default_member_permissions?: bigint[];
	public readonly dm_permission?: boolean;
	public readonly options?: ApplicationCommandOptionData[];

	public readonly testMode: boolean = true; // Default to true, can be overridden in subclasses

	protected constructor(payload: C) {
		this.name = payload.name;
		this.description = payload.description;
		this.default_member_permissions = payload.userPermissions;
		this.dm_permission = payload.dmPermission;
		this.options = payload.options;
		this.testMode = payload.testMode;
	}

	public abstract chatInput(interaction: ChatInputCommandInteraction, client?: ModerationClient): void;
}
