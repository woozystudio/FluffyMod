import { Command, CommandPayload } from "botten";
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	MessageFlags,
	PermissionFlagsBits,
} from "discord.js";
import roleSetup from "../../database/RoleSetup.js";
import { Emoji } from "../../utils/constants.js";
import ReportSetup from "../../database/ReportSetup.js";

export default class ConfigCommand extends Command<CommandPayload> {
	public constructor() {
		super({
			name: "config",
			description: "Configure all bot systems from here.",
			userPermissions: [PermissionFlagsBits.ManageGuild],
			options: [
				{
					name: "muting",
					description: "Add the muting system to your server.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "role",
							description: "Select the mute role.",
							type: ApplicationCommandOptionType.Role,
							required: true,
						},
					],
				},
				{
					name: "reporting",
					description: "Add the reporting system to your server.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "channel",
							description: "Select the report channel.",
							type: ApplicationCommandOptionType.Channel,
							required: true,
						},
					],
				},
			],
			testMode: false,
		});
	}

	public async chatInput(interaction: ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand();

		switch (subcommand) {
			case "muting":
				const role = interaction.options.getRole("role", true);

				const muteData = await roleSetup.findOneAndUpdate(
					{ GuildID: interaction.guildId },
					{ RoleID: role.id },
					{ new: true, upsert: true },
				);
				if (!muteData) return;

				await interaction.reply({
					content: `${Emoji.Success} The muting system has been configured correctly on the server.`,
					flags: MessageFlags.Ephemeral,
				});
				break;

			case "reporting":
				const channel = interaction.options.getChannel("channel", true);

				const reportData = await ReportSetup.findOneAndUpdate(
					{ GuildID: interaction.guildId },
					{ ChannelID: channel.id },
					{ new: true, upsert: true },
				);
				if (!reportData) return;

				await interaction.reply({
					content: `${Emoji.Success} The reporting system has been configured correctly on the server.`,
					flags: MessageFlags.Ephemeral,
				});
				break;

			default:
				break;
		}
	}
}
