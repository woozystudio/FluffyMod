import { ModerationClient, Event, EventPayload } from "@foxy/framework";
import { ChatInputCommandInteraction, ClientEvents, Events, MessageFlags } from "discord.js";
import { Emoji } from "../../utils/constants.js";
import { getPermissionName } from "@foxy/utils";

export default class ChatInputCommandValidator extends Event<EventPayload, keyof ClientEvents> {
	public constructor() {
		super({
			name: Events.InteractionCreate,
			once: false,
		});
	}

	public async execute(client: ModerationClient, interaction: ChatInputCommandInteraction) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);
		if (!command) return;

		try {
			if (command.bot_member_permissions) {
				if (!interaction.guild?.members.me?.permissions.has(command.bot_member_permissions)) {
					await interaction.reply({
						content: `${Emoji.Error} I do not have sufficient permissions to perform this action. ${getPermissionName(
							command.bot_member_permissions || [],
						)}`,
						flags: MessageFlags.Ephemeral,
					});
					return;
				}
			}

			if (interaction.isChatInputCommand()) {
				try {
					await command.chatInput(interaction, client);
				} catch (error) {
					console.error(`Error executing command ${interaction.commandName}:`, error);
					await interaction.reply({
						content: "There was an error while executing this command.",
						flags: MessageFlags.Ephemeral,
					});
				}
			}
		} catch (error) {
			console.error(`Error executing command ${interaction.commandName}:`, error);
			await interaction.reply({
				content: "There was an error while executing this command.",
				flags: MessageFlags.Ephemeral,
			});
		}
	}
}
