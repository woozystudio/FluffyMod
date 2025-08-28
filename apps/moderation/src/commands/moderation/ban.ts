import { Command, CommandPayload } from "@moderation/framework";
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	GuildMember,
	PermissionFlagsBits,
} from "discord.js";
import { Emoji } from "../../utils/constants.js";

export default class BanCommand extends Command<CommandPayload> {
	public constructor() {
		super({
			name: "ban",
			description: "Remove a member from the server with a ban.",
			userPermissions: [PermissionFlagsBits.BanMembers],
			options: [
				{
					name: "target",
					description: "Select a server user.",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
			],
			testMode: false,
		});
	}

	public async chatInput(interaction: ChatInputCommandInteraction) {
		const target = interaction.options.getUser("target", true);
		const member = (await interaction.guild?.members.fetch(target.id)) as GuildMember;

		await member.ban();

		await interaction.reply({
			content: `${Emoji.Success} User ${target} has been successfully banned from the server.`,
		});
	}
}
