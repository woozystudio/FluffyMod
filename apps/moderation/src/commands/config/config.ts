import { Command, CommandPayload } from "@moderation/framework";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import roleSetup from "../../database/RoleSetup.js";
import { Emoji } from "../../utils/constants.js";

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
			],
			testMode: false,
		});
	}

	public async chatInput(interaction: ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand();

		switch (subcommand) {
			case "muting":
				const role = interaction.options.getRole("role", true);

				const data = await roleSetup.findOneAndUpdate(
					{ GuildID: interaction.guildId },
					{ RoleID: role.id },
					{ new: true, upsert: true },
				);
				if (!data) return;

				await interaction.reply({
					content: `${Emoji.Success} The muting system has been configured correctly on the server.`,
				});
				break;

			default:
				break;
		}
	}
}
