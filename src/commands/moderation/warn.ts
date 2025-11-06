import { Command, CommandPayload } from "botten";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import Warning from "../../database/Warning.js";
import { Emoji } from "../../utils/constants.js";

export default class WarningCommand extends Command<CommandPayload> {
	constructor() {
		super({
			name: "warn",
			description: "Warn a user",
			userPermissions: [PermissionFlagsBits.ModerateMembers],
			options: [
				{
					name: "target",
					description: "Select a server user to warn.",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: "reason",
					description: "Reason for the warning.",
					type: ApplicationCommandOptionType.String,
					required: false,
				},
			],
			testMode: false,
		});
	}

	override async chatInput(interaction: ChatInputCommandInteraction) {
		const target = interaction.options.getUser("target", true);
		const reason = interaction.options.getString("reason") || "No reason provided";
		const warningN = (await Warning.countDocuments({ TargetID: target.id })) + 1;
		const createdAt = Math.floor(interaction.createdTimestamp / 1000);

		await Warning.create({
			GuildID: interaction.guild!.id,
			TargetID: target.id,
			ModeratorID: interaction.user.id,
			Reason: reason,
			ID: warningN,
			CreatedAt: createdAt,
		});

		await interaction.reply({
			content: `${Emoji.Success} The user ${target} has been warned correctly.`,
		});
	}
}
