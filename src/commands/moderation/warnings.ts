import { Command, CommandPayload } from "botten";
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	ContainerBuilder,
	MessageFlags,
	PermissionFlagsBits,
	SectionBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
	ThumbnailBuilder,
} from "discord.js";
import Warning from "../../database/Warning.js";
import { Emoji } from "../../utils/constants.js";

export default class WarningsCommand extends Command<CommandPayload> {
	constructor() {
		super({
			name: "warnings",
			description: "Check the warnings of a server user.",
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

	override async chatInput(interaction: ChatInputCommandInteraction) {
		const target = interaction.options.getUser("target", true);

		// const fetchWarning = await Warning.findOne({
		// 	GuildID: interaction.guild!.id,
		// 	TargetID: target.id,
		// });

		const warningCount = await Warning.countDocuments({
			GuildID: interaction.guild!.id,
			TargetID: target.id,
		});

		if (warningCount === 0)
			return void interaction.reply({
				content: `${Emoji.Error} The user mentioned has no warnings.`,
				flags: MessageFlags.Ephemeral,
			});

		const warnings = await Warning.find({
			GuildID: interaction.guild!.id,
			TargetID: target.id,
		});

		const header = new TextDisplayBuilder().setContent(`## Warnings for @${target.username}`);
		const description = new TextDisplayBuilder().setContent(`\`⚠️\` Total warnings: **${warningCount}**`);
		const thumbnail = new ThumbnailBuilder().setURL(target.displayAvatarURL({ size: 4096, extension: "png" }));
		const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large);

		const section = new SectionBuilder().addTextDisplayComponents(header, description).setThumbnailAccessory(thumbnail);
		const container = new ContainerBuilder().addSectionComponents(section).addSeparatorComponents(separator);

		warnings.forEach((warning) => {
			const warningField = new TextDisplayBuilder().setContent(
				`**Moderator: ${warning.ModeratorUsername}**\n${warning.Reason} - <t:${warning.CreatedAt}:R>`,
			);

			container.addTextDisplayComponents(warningField);
		});

		await interaction.reply({
			flags: [MessageFlags.IsComponentsV2],
			components: [container],
			allowedMentions: { parse: [] },
		});
	}
}
