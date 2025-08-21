import { Command } from "@moderation/framework";
import { avatarCommand } from "../../interactions/avatar.js";
import {
	ChatInputCommandInteraction,
	ContainerBuilder,
	MediaGalleryBuilder,
	MessageFlags,
	TextDisplayBuilder,
} from "discord.js";

export default class AvatarCommand extends Command<typeof avatarCommand> {
	public constructor() {
		super(avatarCommand);
	}

	public async chatInput(interaction: ChatInputCommandInteraction) {
		const target = interaction.options.getUser("target") || interaction.user;

		const container = new ContainerBuilder();

		const username = new TextDisplayBuilder().setContent(`## @${target.username}'s avatar`);
		const mediaBuilder = new MediaGalleryBuilder().addItems([
			{
				media: {
					url: target.displayAvatarURL({ size: 4096, extension: "png" }),
				},
			},
		]);

		container.addTextDisplayComponents(username);
		container.addMediaGalleryComponents(mediaBuilder);

		const footer = new TextDisplayBuilder().setContent(`-# Requested by ${interaction.user}`);

		container.addTextDisplayComponents(footer);

		interaction.reply({
			flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
			components: [container],
			allowedMentions: { parse: [] },
		});
	}
}
