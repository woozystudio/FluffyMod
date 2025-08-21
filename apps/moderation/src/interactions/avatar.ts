import { CommandPayload } from "@moderation/framework";
import { ApplicationCommandOptionType } from "discord.js";

export const avatarCommand: CommandPayload = {
	name: "avatar",
	description: "Get a user's avatar.",
	options: [
		{
			name: "target",
			description: "Select a server member.",
			type: ApplicationCommandOptionType.User,
		},
	],
	testMode: false,
};
