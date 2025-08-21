import { CommandPayload } from "@moderation/framework";
import { ApplicationCommandOptionType } from "discord.js";

export const userinfoCommand: CommandPayload = {
	name: "userinfo",
	description: "Explore a user's public information on the server.",
	options: [
		{
			name: "target",
			description: "Select a server member.",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
	],
};
