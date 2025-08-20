import { REST } from "@discordjs/rest";
import { getLocalCommands } from "./getLocalCommands.js";
import { Routes } from "discord.js";
import { ModerationClient } from "../structures/ModerationClient.js";
import { translateToJSON } from "./translateToJSON.js";

export async function registerCommands(client: ModerationClient, guildId?: string) {
	try {
		const localCommands = await getLocalCommands(client);

		for (const localCommand of localCommands) {
			client.commands.set(localCommand.name, localCommand);
		}

		const rest = new REST({ version: "10" }).setToken(client.token);

		try {
			await rest.put(Routes.applicationCommands(client.id), {
				body: translateToJSON(client.commands.filter((command) => !command.testMode)),
			});

			await rest.put(Routes.applicationGuildCommands(client.id, guildId as string), {
				body: translateToJSON(client.commands.filter((command) => command.testMode)),
			});

			console.log("Application commands registered successfully.");
		} catch (error) {
			console.error(error);
		}
	} catch (error) {
		console.error("Failed to register application commands:", error);
	}
}
