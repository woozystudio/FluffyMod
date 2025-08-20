import { Collection } from "discord.js";
import { Command } from "../structures/Command.js";
import { CommandPayload } from "../types/Command.js";

export function translateToJSON(
	commands: Collection<string, Command<CommandPayload>>,
): object[] {
	const data: object[] = [];

	commands.forEach((command: Command<CommandPayload>) => {
		data.push({
			name: command.name,
			description: command.description,
			default_member_permissions: command.default_member_permissions,
			dm_permission: command.dm_permission,
			options: command.options,
		});
	});

	return data;
}
