import { ModerationClient, Event, EventPayload } from "@moderation/framework";
import { ButtonInteraction, ChatInputCommandInteraction, ClientEvents, Events, MessageFlags } from "discord.js";

export default class InteractionCreate extends Event<EventPayload, keyof ClientEvents> {
	public constructor() {
		super({
			name: Events.InteractionCreate,
			once: false,
		});
	}

	public async execute(client: ModerationClient, interaction: ChatInputCommandInteraction | ButtonInteraction) {
		if (interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;

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

		if (interaction.isButton()) {
			const button = client.buttons.get(interaction.customId);
			if (!button) return;

			try {
				await button.execute(interaction, client);
			} catch (error) {
				console.error(`Error executing button ${interaction.customId}:`, error);
				await interaction.reply({
					content: "There was an error while executing this button.",
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	}
}
