import { Command, CommandPayload } from "botten";
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	GuildMember,
	PermissionFlagsBits,
} from "discord.js";
import { ms } from "@naval-base/ms";
import { Emoji } from "../../utils/constants.js";

export default class TimeoutCommand extends Command<CommandPayload> {
	public constructor() {
		super({
			name: "timeout",
			description: "Timeout a server user.",
			userPermissions: [PermissionFlagsBits.ModerateMembers],
			options: [
				{
					name: "target",
					description: "Select a server user.",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: "duration",
					description: "Write the duration with the format: 1s, 1m, 1h, 1d, 1w and 1y",
					required: true,
					type: ApplicationCommandOptionType.String,
				},
			],
			testMode: false,
		});
	}

	public async chatInput(interaction: ChatInputCommandInteraction) {
		const target = interaction.options.getUser("target", true);
		const member = (await interaction.guild?.members.fetch(target.id)) as GuildMember;
		const duration = interaction.options.getString("duration", true);

		const durationMs = ms(duration);
		const timeoutExpiresAt = Math.floor((Date.now() + durationMs) / 1000);

		await member.timeout(durationMs);

		await interaction.reply({
			content: `${Emoji.Success} A timeout has been applied to user ${target} with a duration of <t:${timeoutExpiresAt}:R>`,
		});
	}
}
