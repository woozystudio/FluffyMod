import { ClientEvents } from "discord.js";
import { getEvents } from "../utils/getEvents.js";
import { ModerationClient } from "../structures/ModerationClient.js";

export async function eventHandler(client: ModerationClient) {
	try {
		const localEvents = await getEvents(client);

		for (const localEvent of localEvents) {
			if (localEvent.once) {
				client.client.once(localEvent.name, (...args: ClientEvents[keyof ClientEvents]) =>
					localEvent.execute(client, ...args),
				);
			} else {
				client.client.on(localEvent.name, (...args: ClientEvents[keyof ClientEvents]) =>
					localEvent.execute(client, ...args),
				);
			}
		}
	} catch (error) {
		console.error("Error loading events:", error);
	}
}
