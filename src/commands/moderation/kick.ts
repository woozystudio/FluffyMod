import { Command, CommandPayload } from "botten";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Emoji } from "../../utils/constants.js";
import { ValidatorManager } from "../../utils/ValidatorManager.js";

export default class KickCommand extends Command<CommandPayload> {
	public constructor() {
		super({
			name: "kick",
			description: "Kicks a member from the server.",
			userPermissions: [PermissionFlagsBits.KickMembers],
			botPermissions: [PermissionFlagsBits.KickMembers],
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

		const validation = await new ValidatorManager(interaction, target).moderation();
		if (!validation) return;

		const member = await interaction.guild?.members.fetch(target.id).catch(() => null);

		await member?.kick();

		await interaction.reply({
			content: `${Emoji.Success} User ${target} has been successfully kicked from the server.`,
		});
	}
}
