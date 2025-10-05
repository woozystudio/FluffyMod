import { ModerationClient, Event, EventPayload } from "@woozystudio/botten";
import { ButtonInteraction, ClientEvents, Events, MessageFlags } from "discord.js";

export default class ButtonValidator extends Event<EventPayload, keyof ClientEvents> {
	public constructor() {
		super({
			name: Events.InteractionCreate,
			once: false,
		});
	}

	public async execute(client: ModerationClient, interaction: ButtonInteraction) {
		if (!interaction.isButton()) return;

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
