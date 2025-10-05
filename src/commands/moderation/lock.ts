import { Command, CommandPayload } from "@woozystudio/botten";
import {
	ApplicationCommandOptionType,
	ChannelType,
	ChatInputCommandInteraction,
	MessageFlags,
	PermissionFlagsBits,
	PermissionsBitField,
	TextChannel,
} from "discord.js";
import { Emoji } from "../../utils/constants.js";

export default class LockCommand extends Command<CommandPayload> {
	public constructor() {
		super({
			name: "lock",
			description: "Remove write permissions for @everyone from a channel.",
			userPermissions: [PermissionFlagsBits.ManageChannels],
			options: [
				{
					name: "channel",
					description: "Select a server channel.",
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.GuildAnnouncement, ChannelType.GuildText],
				},
			],
			testMode: false,
		});
	}

	public async chatInput(interaction: ChatInputCommandInteraction) {
		const channel = (interaction.options.getChannel("channel") || interaction.channel) as TextChannel;

		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const botMember = interaction.guild?.members.me;
		if (!botMember) {
			await interaction.editReply({
				content: `${Emoji.Error} The server was unable to verify my permissions correctly.`,
			});
			return;
		}

		const botPermissions = channel.permissionsFor(botMember);

		if (!botPermissions?.has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageChannels])) {
			await interaction.editReply({
				content: `${Emoji.Error} I don't have sufficient permissions to manage that channel.`,
			});
			return;
		}

		const {
			ViewChannel,
			SendMessages,
			AddReactions,
			CreatePrivateThreads,
			CreatePublicThreads,
			SendMessagesInThreads,
			UseApplicationCommands,
		} = PermissionFlagsBits;

		if (
			!channel
				.permissionsFor(interaction.guild?.roles.everyone.id as string)
				?.has(
					ViewChannel |
						SendMessages |
						AddReactions |
						CreatePrivateThreads |
						CreatePublicThreads |
						SendMessagesInThreads |
						UseApplicationCommands,
				)
		) {
			await interaction.editReply({
				content: `${Emoji.Error} This channel is already locked, try with another.`,
			});
			return;
		}

		await channel.permissionOverwrites.edit(interaction.guild?.id as string, {
			SendMessages: false,
			AddReactions: false,
			CreatePrivateThreads: false,
			CreatePublicThreads: false,
			SendMessagesInThreads: false,
			UseApplicationCommands: false,
		});

		await interaction.editReply({
			content: `${Emoji.Success} The channel has been successfully locked.`,
		});
	}
}
