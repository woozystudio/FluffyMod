import { Command, CommandPayload } from "botten";
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	MessageFlags,
	PermissionFlagsBits,
	TextChannel,
	time,
} from "discord.js";
import { Color, Emoji } from "../../utils/constants.js";
import Ticket from "../../database/Ticket.js";
import TicketSetup from "../../database/TicketSetup.js";

export default class CloseCommand extends Command<CommandPayload> {
	constructor() {
		super({
			name: "close",
			description: "Close a support ticket",
			userPermissions: [PermissionFlagsBits.ManageChannels],
			botPermissions: [PermissionFlagsBits.ManageChannels],
			dmPermission: false,
			options: [
				{
					name: "ticket",
					description: "Select the ticket to close",
					type: ApplicationCommandOptionType.String,
					required: false,
				},
			],
			testMode: false,
		});
	}

	override async chatInput(interaction: ChatInputCommandInteraction) {
		const ticketId = interaction.options.getString("ticket");
		const data = await TicketSetup.findOne({ GuildID: interaction.guild!.id });
		if (!data) return void interaction.reply({ content: `${Emoji.Error} Ticket system is not set up in this server.` });

		try {
			const closingEmbed = new EmbedBuilder()
				.setColor(Color.Success)
				.setDescription(
					`${Emoji.Success} The ticket will be closed and the channel will be deleted in ${time(
						Math.floor(Date.now() / 1000) + 5,
						"R",
					)}.`,
				);

			if (!ticketId) {
				// TODO: Create this system using the channel ID rather than the ticket ID

				const intChannel = (await interaction.guild?.channels.fetch(interaction.channelId)) as TextChannel;

				const allTickets = await Ticket.find({ GuildID: interaction.guild!.id, Locked: false });

				if (!allTickets.length) {
					return void interaction.reply({
						content: `${Emoji.Error} It appears that there are no tickets on this server.`,
						ephemeral: false,
					});
				}

				// 2️⃣ Extract the IDs
				const ticketIDs = allTickets.map((doc) => String(doc.ID));

				// 3️⃣ Check if the channel name contains any of those IDs.
				const match = ticketIDs.some((id) => intChannel.name.includes(id));

				if (!match) {
					return void interaction.reply({
						content: `${Emoji.Error} This command can only be used in a ticket channel.`,
						ephemeral: false,
					});
				}

				await interaction.reply({
					embeds: [closingEmbed],
				});

				setTimeout(async () => {
					await intChannel.delete();
					await Ticket.deleteOne({ GuildID: interaction.guild!.id, ChannelID: intChannel.id });
				}, 5000);
			} else {
				const ticketData = await Ticket.findOne({ GuildID: interaction.guild!.id, Locked: false, ID: ticketId });
				if (!ticketData) {
					return void interaction.reply({
						content: `${Emoji.Error} The specified ticket ID does not exist or is locked.`,
						ephemeral: false,
					});
				}

				const channel = (await interaction.guild!.channels.fetch(ticketData.ChannelID as string)) as TextChannel;
				if (!channel) {
					return void interaction.reply({
						content: `${Emoji.Error} The channel for the specified ticket ID could not be found.`,
						ephemeral: false,
					});
				}

				await interaction.reply({
					embeds: [closingEmbed],
				});

				setTimeout(async () => {
					await channel.delete();
					await Ticket.deleteOne({ GuildID: interaction.guild!.id, ID: ticketId });
				}, 5000);
			}
		} catch (error) {
			console.error(error);
			return void interaction.reply({
				content: `${Emoji.Error} An error occurred while closing the ticket.`,
				flags: [MessageFlags.Ephemeral],
			});
		}
	}
}
