import { ApplicationCommandOptionData } from "discord.js";

export type CommandPayload = {
	name: string;
	description: string;
	userPermissions?: bigint[];
	dmPermission?: boolean;
	options?: ApplicationCommandOptionData[];

	testMode: boolean; // Optional, defaults to true
};
