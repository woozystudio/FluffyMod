import { BottenClient, Event, EventPayload } from "botten";
import { AutocompleteInteraction, ClientEvents, Events } from "discord.js";

export default class AutoCompleteValidator extends Event<EventPayload, keyof ClientEvents> {
	public constructor() {
		super({
			name: Events.InteractionCreate,
			once: false,
		});
	}

	public async execute(client: BottenClient, interaction: AutocompleteInteraction) {
		if (!interaction.isAutocomplete()) return;

		try {
			return await client.commands.get(interaction.commandName)?.autoComplete?.(interaction, client);
		} catch (error) {
			console.error(`Error executing auto complete from ${interaction.commandName}:`, error);
		}
	}
}
