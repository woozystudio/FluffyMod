import { Command, CommandPayload } from "botten";
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	ContainerBuilder,
	MessageFlags,
	PermissionFlagsBits,
	SectionBuilder,
	TextDisplayBuilder,
	ThumbnailBuilder,
} from "discord.js";
import Warning from "../../database/Warning.js";
import { Emoji } from "../../utils/constants.js";

export default class WarnInfo extends Command<CommandPayload> {
	constructor() {
		super({
			name: "warninfo",
			description: "Get information about the warning system.",
			userPermissions: [PermissionFlagsBits.ModerateMembers],
			dmPermission: false,
			options: [
				{
					name: "target",
					description: "The user to get warning info for.",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: "id",
					description: "The ID of the warning to get info for.",
					type: ApplicationCommandOptionType.Number,
					required: true,
				},
			],
			testMode: false,
		});
	}

	override async chatInput(interaction: ChatInputCommandInteraction) {
		const target = interaction.options.getUser("target", true);
		const id = interaction.options.getNumber("id", true);

		const data = await Warning.findOne({ GuildID: interaction.guildId, TargetID: target.id, ID: id });

		if (!data)
			return void interaction.reply({
				content: `${Emoji.Error} The warning mentioned has not been found.`,
				flags: [MessageFlags.Ephemeral],
			});

		const header = new TextDisplayBuilder().setContent(`## \`⚠️\` Warning #${data?.ID}`);
		const description = new TextDisplayBuilder().setContent(
			`ID: **${data?.ID}**\nIssued by: \`${data?.ModeratorUsername}\` (${data?.ModeratorID})\nMember: \`${data?.TargetUsername}\` (${data?.TargetID})\nDate: <t:${data?.CreatedAt}:F> (<t:${data?.CreatedAt}:R>)\nReason: \`\`\`${data?.Reason}\`\`\``,
		);
		const thumbnail = new ThumbnailBuilder().setURL(target.displayAvatarURL({ size: 4096, extension: "png" }));

		const section = new SectionBuilder().addTextDisplayComponents(header, description).setThumbnailAccessory(thumbnail);
		const container = new ContainerBuilder().addSectionComponents(section);

		await interaction.reply({
			flags: [MessageFlags.IsComponentsV2],
			components: [container],
			allowedMentions: { parse: [] },
		});
	}
}
