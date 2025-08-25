import { Command, CommandPayload } from "@moderation/framework";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import RoleSetup from "../../database/RoleSetup.js";
import { Emoji } from "../../utils/constants.js";

export default class UnMuteCommand extends Command<CommandPayload> {
	public constructor() {
		super({
			name: "unmute",
			description: "Unmute a server user with the configured role.",
			userPermissions: [PermissionFlagsBits.ModerateMembers],
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
		const member = await interaction.guild?.members.fetch(target.id);

		const data = await RoleSetup.findOne({ GuildID: interaction.guildId });
		if (!data) return interaction.reply({ content: `${Emoji.Error} This module is not configured on this server.` });

		await member?.roles.remove(`${data.RoleID}`);
		return interaction.reply({ content: `${Emoji.Success} The user ${target} has been successfully unmuted.` });
	}
}
