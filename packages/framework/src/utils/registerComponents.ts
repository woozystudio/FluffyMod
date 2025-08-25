import { ModerationClient } from "../structures/ModerationClient.js";
import { getButtons } from "./getButtons.js";

export async function registerComponents(client: ModerationClient) {
	try {
		const buttons = await getButtons(client);

		for (const button of buttons) {
			client.buttons.set(button.customId, button);
		}

		console.log("Buttons registered successfully.");
	} catch (error) {
		console.error(error);
	}
}
