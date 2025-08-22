import { Command, CommandPayload } from "@moderation/framework";
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
	ContainerBuilder,
	GuildMember,
	inlineCode,
	MessageFlags,
	SectionBuilder,
	TextDisplayBuilder,
	ThumbnailBuilder,
} from "discord.js";

export default class UserInfoCommand extends Command<CommandPayload> {
	public constructor() {
		super({
			name: "userinfo",
			description: "Explore a user's public information on the server.",
			options: [
				{
					name: "target",
					description: "Select a server member.",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
			],
			testMode: false,
		});
	}

	public async chatInput(interaction: ChatInputCommandInteraction) {
		const target = interaction.options.getUser("target", true);
		const member = (await interaction.guild?.members.fetch(target.id)) as GuildMember;
		const roles = member?.roles.cache.map((role) => role) ?? [];
		const perms = member?.permissions.toArray().map((p) => inlineCode(p)) ?? [];
		const displayPerms = perms.length > 3 ? `${perms.slice(0, 3).join(" ")} (+${perms.length - 3})` : perms.join(" ");

		const displayRoles = roles.length > 3 ? `${roles.slice(0, 3).join(" ")} (+${roles.length - 3})` : roles.join(" ");

		const thumbnail = new ThumbnailBuilder().setURL(target.displayAvatarURL({ size: 4096, extension: "png" }));
		const username = new TextDisplayBuilder().setContent(`## @${target.username}`);
		const mainInfo = new TextDisplayBuilder().setContent(
			`${target} (\`${target.id}\`)\n\n**Created at**: <t:${parseInt(
				`${target.createdTimestamp / 1000}`,
			)}> (<t:${parseInt(`${target.createdTimestamp / 1000}`)}:R>)\n**Joined at**: <t:${parseInt(
				`${(member.joinedTimestamp as number) / 1000}`,
			)}> (<t:${parseInt(
				`${(member.joinedTimestamp as number) / 1000}`,
			)}:R>)\n\n**Permissions (User)**:\n${displayPerms}\n\n**Roles**: ${displayRoles}`,
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
