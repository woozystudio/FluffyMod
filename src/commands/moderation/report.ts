import { Command, CommandPayload, ModerationClient } from "@woozystudio/botten";
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	ContainerBuilder,
	MessageFlags,
	PermissionFlagsBits,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextChannel,
	TextDisplayBuilder,
} from "discord.js";
import ReportSetup from "../../database/ReportSetup.js";
import { Emoji } from "../../utils/constants.js";
import { generateReportId } from "../../functions/reports/generateReportId.js";
import Report from "../../database/Report.js";

export default class ReportCommand extends Command<CommandPayload> {
	public constructor() {
		super({
			name: "report",
			description: "Report a message to the moderation team.",
			userPermissions: [PermissionFlagsBits.UseApplicationCommands],
			botPermissions: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
			options: [
				{
					name: "target",
					description: "Select a user to report.",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: "reason",
					description: "Provide a reason for the report.",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
			testMode: false,
		});
	}

	public async chatInput(interaction: ChatInputCommandInteraction, client: ModerationClient) {
		const target = interaction.options.getUser("target", true);
		const reason = interaction.options.getString("reason", true);
		const id = generateReportId();

		const data = await ReportSetup.findOne({ GuildID: interaction.guildId });
		if (!data) return interaction.reply({ content: `${Emoji.Error} This module is not configured on this server.` });

		const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large);

		const information = new TextDisplayBuilder({
			content: `## Report by @${interaction.user.username}\nA new report has been created by user ${interaction.user}.`,
		});

		const container = new ContainerBuilder().addTextDisplayComponents(information).addSeparatorComponents(separator);

		const createdAt = Math.floor(interaction.createdTimestamp / 1000);

		const details = new TextDisplayBuilder({
			content: `**Target**: ${target} (${target.id})\n**Time**: <t:${createdAt}> (<t:${createdAt}:R>)\n**Reason**: ${reason}`,
		});

		container.addTextDisplayComponents(details);

		const footer = new TextDisplayBuilder({
			content: `-# ID: ${id} | Guild: ${interaction.guild?.name}`,
		});

		container.addTextDisplayComponents(footer);

		const reportEntry = await Report.create({
			GuildID: interaction.guildId!,
			ID: id,
			AuthorID: interaction.user.id,
			TargetID: target.id,
			Reason: reason,
			CreatedAt: createdAt,
			Closed: false,
		});

		reportEntry.save();

		if (!data.ChannelID)
			return interaction.reply({ content: `${Emoji.Error} This module is not configured on this server.` });

		const interactionBot = await interaction.guild?.members.fetch(client.client.user!.id);
		const channel = (await interaction.guild?.channels.fetch(data.ChannelID)) as TextChannel;

		if (
			channel
				?.permissionsFor(interactionBot!)
				?.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]) === false
		) {
			return interaction.reply({
				content: `${Emoji.Error} I do not have permission to send messages in the configured report channel.`,
			});
		}

		await channel.send({
			components: [container],
			flags: MessageFlags.IsComponentsV2,
			allowedMentions: { parse: [] },
		});

		return interaction.reply({
			content: "`🫂` Thank you for your report. Our moderation team will review it shortly.",
			flags: MessageFlags.Ephemeral,
		});
	}
}
