import { Command, CommandPayload } from "@woozystudio/botten";
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import { Emoji } from "../../utils/constants.js";

export default class UnBanCommand extends Command<CommandPayload> {
	public constructor() {
		super({
			name: "unban",
			description: "Unban a previously banned member..",
			userPermissions: [PermissionFlagsBits.BanMembers],
			options: [
				{
					name: "id",
					description: "Enter the banned user ID.",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
			testMode: false,
		});
	}

	public async chatInput(interaction: ChatInputCommandInteraction) {
		const id = interaction.options.getString("id", true);
		const searchBan = await interaction.guild?.bans.fetch(id).catch(() => undefined);

		if (searchBan === undefined) {
			await interaction.reply({
				content: `${Emoji.Error} The provided ID is not banned from the server.`,
				flags: MessageFlags.Ephemeral,
			});

			return;
		} else {
			await interaction.guild?.bans.remove(id);

			await interaction.reply({
				content: `${Emoji.Success} User <@${id}> (\`${id}\`) has been successfully banned from the server.`,
				flags: MessageFlags.Ephemeral,
			});
		}
	}
}
