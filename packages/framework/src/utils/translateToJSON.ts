import { Collection } from "discord.js";
import { Command } from "../structures/Command.js";
import { CommandPayload } from "../types/Command.js";

export function translateToJSON(commands: Collection<string, Command<CommandPayload>>): object[] {
	const data: object[] = [];

	commands.forEach((command: Command<CommandPayload>) => {
		data.push({
			name: command.name,
			description: command.description,
		});
	});

	return data;
}
