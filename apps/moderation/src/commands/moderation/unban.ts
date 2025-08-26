import { Command, CommandPayload } from "@moderation/framework";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Emoji } from "../../utils/constants.js";

export default class UnBanCommand extends Command<CommandPayload> {
	public constructor() {
		super({
			name: "unban",
			description: "Unban a previously banned member..",
			userPermissions: PermissionFlagsBits.BanMembers,
			options: [
				{
					name: "id",
					description: "Enter the banned user ID.",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
			testMode: true,
		});
	}

	public async chatInput(interaction: ChatInputCommandInteraction) {
		const id = interaction.options.getString("id", true);
		await interaction.guild?.bans.remove(id);

		await interaction.reply({
			content: `${Emoji.Success} User <@${id}> (\`${id}\`) has been successfully banned from the server.`,
		});
	}
}
