import { BottenClient, Command, CommandPayload } from "botten";
import {
	ChannelType,
	ChatInputCommandInteraction,
	ContainerBuilder,
	MessageFlags,
	PermissionFlagsBits,
	SectionBuilder,
	TextDisplayBuilder,
	ThumbnailBuilder,
} from "discord.js";
import { Emoji } from "../../utils/constants.js";
import TicketSetup from "../../database/TicketSetup.js";
import Ticket from "../../database/Ticket.js";

export default class TicketCommand extends Command<CommandPayload> {
	constructor() {
		super({
			name: "ticket",
			description: "Create a support ticket",
			botPermissions: [PermissionFlagsBits.ManageChannels],
			dmPermission: false,
			testMode: false,
		});
	}

	override async chatInput(interaction: ChatInputCommandInteraction, client: BottenClient) {
		const data = await TicketSetup.findOne({ GuildID: interaction.guild!.id });
		if (!data) return void interaction.reply({ content: `${Emoji.Error} Ticket system is not set up in this server.` });
		const ticketId = Math.floor(Math.random() * 9000) + 10000;

		try {
			await interaction
				.guild!.channels.create({
					name: `${interaction.user.username}-${ticketId}`,
					parent: data.ParentID,
					type: ChannelType.GuildText,
					permissionOverwrites: [
						{
							id: interaction.guild!.roles.everyone,
							deny: [PermissionFlagsBits.ViewChannel],
						},
						{
							id: interaction.user.id && client.client.user!.id,
							allow: [
								PermissionFlagsBits.ViewChannel,
								PermissionFlagsBits.SendMessages,
								PermissionFlagsBits.ReadMessageHistory,
							],
						},
					],
				})
				.then(async (ch) => {
					const createdAt = Math.floor(ch.createdTimestamp / 1000);

					await Ticket.create({
						GuildID: interaction.guild!.id,
						ID: ticketId,
						TargetID: interaction.user.id,
						ChannelID: ch.id,
						CreatedAt: createdAt,
						Locked: false,
					});

					const header = new TextDisplayBuilder().setContent(`## @${interaction.user.username}'s ticket.`);
					const welcomeMessage = new TextDisplayBuilder().setContent(
						`\`👋\` Hello ${interaction.user}, welcome to your support ticket!\nA member of our team will be with you shortly.\n\nPlease describe your issue in detail so we can assist you better.`,
					);
					const thumbnail = new ThumbnailBuilder().setURL(interaction.user.displayAvatarURL());

					const section = new SectionBuilder()
						.addTextDisplayComponents(header, welcomeMessage)
						.setThumbnailAccessory(thumbnail);
					const container = new ContainerBuilder().addSectionComponents(section);

					await ch.send({
						flags: [MessageFlags.IsComponentsV2],
						components: [container],
						allowedMentions: { parse: [] },
					});

					await interaction.reply({
						content: `${Emoji.Success} Your ticket was successfully created in the ${ch} channel.`,
						flags: [MessageFlags.Ephemeral],
					});
				});
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: `${Emoji.Error} An error occurred while creating the ticket.`,
				flags: [MessageFlags.Ephemeral],
			});
		}
	}
}
