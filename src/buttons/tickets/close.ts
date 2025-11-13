import { Button, ButtonPayload } from "botten";
import { ButtonInteraction, EmbedBuilder, TextChannel, time } from "discord.js";
import { Color, Emoji } from "../../utils/constants.js";
import Ticket from "../../database/Ticket.js";

export default class CloseTicketButton extends Button<ButtonPayload> {
	constructor() {
		super({
			customId: "ticket-close",
			description: "Used to close tickets.",
		});
	}

	override async execute(interaction: ButtonInteraction) {
		const ticketData = await Ticket.findOne({
			GuildID: interaction.guild!.id,
			Locked: false,
			Closing: false,
			ChannelID: interaction.channelId,
		});

		if (!ticketData) {
			return void interaction.reply({
				content: `${Emoji.Error} The ticket is locked or is being closed.`,
				ephemeral: true,
			});
		}

		const channel = (await interaction.guild!.channels.fetch(interaction.channelId)) as TextChannel;
		if (!channel) {
			return void interaction.reply({
				content: `${Emoji.Error} The channel for the specified ticket ID could not be found.`,
				ephemeral: false,
			});
		}

		await ticketData.updateOne({ Closing: true });

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(Color.Success)
					.setDescription(
						`${Emoji.Success} The ticket will be closed and the channel will be deleted in ${time(
							Math.floor(Date.now() / 1000) + 5,
							"R",
						)}.`,
					),
			],
		});

		setTimeout(async () => {
			await channel.delete();
			await Ticket.deleteOne({ GuildID: interaction.guild!.id, ChannelID: interaction.channelId });
		}, 5000);
	}
}
