import { Command, ModerationClient } from "@moderation/framework";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	ClientUser,
	ContainerBuilder,
	MessageFlags,
	SectionBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	TextDisplayBuilder,
	ThumbnailBuilder,
} from "discord.js";
import { botinfoCommand } from "../../interactions/botinfo.js";

export default class BotInfoCommand extends Command<typeof botinfoCommand> {
	public constructor() {
		super(botinfoCommand);
	}

	public async chatInput(interaction: ChatInputCommandInteraction, client: ModerationClient) {
		const bot = client.client.user as ClientUser;
		const owner = await client.client.users.fetch(process.env.OWNER_ID as string);

		const thumbnail = new ThumbnailBuilder().setURL(bot.avatarURL({ size: 4096, extension: "png" }) as string);
		const ownerThumbnail = new ThumbnailBuilder().setURL(owner.avatarURL({ size: 4096, extension: "png" }) as string);
		const username = new TextDisplayBuilder().setContent(`## ${bot.displayName}`);
		const mainInfo = new TextDisplayBuilder().setContent(
			`${bot.displayName} is a Discord bot developed to facilitate server moderation, providing optimized and useful solutions and systems to users. We would greatly appreciate it if you would add this bot to your server and give it a chance to show you its full potential.`,
		);

		const extraInfo = new TextDisplayBuilder().setContent(`
			## My Owner\nThis bot was created in <t:${parseInt(`${bot.createdTimestamp / 1000}`)}> (<t:${parseInt(
			`${bot.createdTimestamp / 1000}`,
		)}:R>) by [WoozyStudio](https://discord.com/users/869583777884667964), a Discord bot developer with 5 years of experience. I recommend checking out their [website](https://woozystudio.com) and [GitHub page](https://github.com/woozystudio).
		`);

		const separator = new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large);
		const section1 = new SectionBuilder().setThumbnailAccessory(thumbnail).addTextDisplayComponents(username, mainInfo);
		const section2 = new SectionBuilder().setThumbnailAccessory(ownerThumbnail).addTextDisplayComponents(extraInfo);

		const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel("Source")
				.setStyle(ButtonStyle.Link)
				.setURL("https://github.com/woozystudio/Moderation"),
			new ButtonBuilder()
				.setLabel("Website")
				.setStyle(ButtonStyle.Link)
				.setURL("https://woozystudio.com/projects/moderation"),
			new ButtonBuilder()
				.setLabel("Invite")
				.setStyle(ButtonStyle.Link)
				.setURL("https://discord.com/oauth2/authorize?client_id=1383538018664579154"),
			new ButtonBuilder().setLabel("Support").setStyle(ButtonStyle.Link).setURL("https://discord.com/invite/"),
		);

		const container = new ContainerBuilder()
			.addSectionComponents(section1)
			.addSeparatorComponents(separator)
			.addSectionComponents(section2)
			.addActionRowComponents(buttons);

		interaction.reply({
			flags: [MessageFlags.IsComponentsV2],
			components: [container],
			allowedMentions: { parse: [] },
		});
	}
}
