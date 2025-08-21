import { CommandPayload } from "@moderation/framework";
import { ApplicationCommandOptionType } from "discord.js";

export const userinfoCommand: CommandPayload = {
	name: "userinfo",
	description: "Get information about a user.",
	options: [
		{
			name: "target",
			description: "Select a server member.",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
	],
};
