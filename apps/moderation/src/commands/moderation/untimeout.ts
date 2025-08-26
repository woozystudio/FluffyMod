import { Command, CommandPayload } from "@moderation/framework";
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	GuildMember,
	PermissionFlagsBits,
} from "discord.js";
import { Emoji } from "../../utils/constants.js";

export default class UnTimeoutCommand extends Command<CommandPayload> {
	public constructor() {
		super({
			name: "untimeout",
			description: "Untimeout a server user.",
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
		const member = (await interaction.guild?.members.fetch(target.id)) as GuildMember;

		await member.timeout(null);

		await interaction.reply({
			content: `${Emoji.Success} The user ${target} has been untimeout successfully.`,
		});
	}
}
