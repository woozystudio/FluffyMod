import { ChatInputCommandInteraction, MessageFlags, User } from "discord.js";
import { Emoji } from "./constants.js";

export class ValidatorManager {
	interaction: ChatInputCommandInteraction;
	target: User;

	public constructor(interaction: ChatInputCommandInteraction, target: User) {
		this.interaction = interaction;
		this.target = target;
	}

	public async moderation(): Promise<boolean> {
		const guild = this.interaction.guild;
		if (!guild) return false;

		const member = await guild.members.fetch(this.target.id).catch(() => null);
		const interactionMember = await guild.members.fetch(this.interaction.user.id).catch(() => null);
		const bot = await guild.members.fetchMe().catch(() => null);

		if (!member) {
			await this.interaction.reply({
				content: `${Emoji.Error} The specified user is not a member of this server.`,
				flags: MessageFlags.Ephemeral,
			});
			return false;
		}

		if (!interactionMember || !bot) return false;

		if (member.id === bot.id) {
			await this.interaction.reply({
				content: `${Emoji.Error} You can't penalize me, try another user.`,
				flags: MessageFlags.Ephemeral,
			});
			return false;
		}

		if (member.id === this.interaction.user.id) {
			await this.interaction.reply({
				content: `${Emoji.Error} You can't penalize yourself, try another user.`,
				flags: MessageFlags.Ephemeral,
			});
			return false;
		}

		if (member.roles.highest.position >= interactionMember.roles.highest.position) {
			await this.interaction.reply({
				content: `${Emoji.Error} You can't penalize this user because they have the same or higher role than you.`,
				flags: MessageFlags.Ephemeral,
			});
			return false;
		}

		if (member.roles.highest.position >= bot.roles.highest.position) {
			await this.interaction.reply({
				content: `${Emoji.Error} I can't penalize this user because they have the same or higher role than me.`,
				flags: MessageFlags.Ephemeral,
			});
			return false;
		}

		if (!member.bannable || !member.kickable || !member.moderatable) {
			await this.interaction.reply({
				content: `${Emoji.Error} I can't penalize this user because they have a higher permission than me.`,
				flags: MessageFlags.Ephemeral,
			});
			return false;
		}

		return true;
	}
}
