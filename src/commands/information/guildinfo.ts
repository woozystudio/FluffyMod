import { Command, CommandPayload } from "botten";
import {
	ChannelType,
	ChatInputCommandInteraction,
	ContainerBuilder,
	Guild,
	MessageFlags,
	SectionBuilder,
	TextDisplayBuilder,
	ThumbnailBuilder,
} from "discord.js";

export default class GuildInfoCommand extends Command<CommandPayload> {
	public constructor() {
		super({
			name: "guildinfo",
			description: "Get a detailed summary of this server.",
			testMode: false,
		});
	}

	public async chatInput(interaction: ChatInputCommandInteraction) {
		const guild = interaction.guild as Guild;
		const owner = await guild.fetchOwner();

		const thumbnail = new ThumbnailBuilder().setURL(guild.iconURL({ size: 4096, extension: "png" }) as string);
		const username = new TextDisplayBuilder().setContent(`## ${guild.name}`);
		const mainInfo = new TextDisplayBuilder().setContent(
			`**ID**: \`${guild.id}\`\n\n**Created at**: <t:${parseInt(`${guild.createdTimestamp / 1000}`)}:F> (<t:${parseInt(
				`${guild.createdTimestamp / 1000}`,
			)}:R>)\n**Owner**: ${owner.user} - \`${owner.user.username}\` (${owner.id})\n**Channels**: ${
				guild?.channels.cache.filter((channel) => channel.type !== ChannelType.GuildCategory).size
			}/500\n**Emojis**: ${guild.emojis.cache.size}/250\n**Roles**: ${guild.roles.cache.size}/250\n**Boosts**: ${
				guild.premiumSubscriptionCount || "0"
			}`,
		);

		const section = new SectionBuilder().setThumbnailAccessory(thumbnail).addTextDisplayComponents(username, mainInfo);

		const container = new ContainerBuilder().addSectionComponents(section);

		interaction.reply({
			flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
			components: [container],
			allowedMentions: { parse: [] },
		});
	}
}
