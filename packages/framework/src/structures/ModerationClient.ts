import { BitFieldResolvable, Client, Collection, GatewayIntentsString } from "discord.js";
import { ModerationClientOptions } from "../types/ModerationClientOptions.js";
import { Command } from "./Command.js";
import { CommandPayload } from "../types/Command.js";
import { registerCommands } from "../utils/registerCommands.js";
import "dotenv/config";
import { eventHandler } from "../handlers/eventHandler.js";
import { Button } from "./Button.js";
import { ButtonPayload } from "../types/Components.js";
import { registerComponents } from "../utils/registerComponents.js";

export class ModerationClient {
	public token: string;
	public id: string;
	public guildId?: string;
	public intents: BitFieldResolvable<GatewayIntentsString, number> = [];
	#client;

	public commands: Collection<string, Command<CommandPayload>> = new Collection();
	public buttons: Collection<string, Button<ButtonPayload>> = new Collection();

	public commandsPath?: string;
	public eventsPath?: string;
	public buttonsPath?: string;

	constructor(options: ModerationClientOptions) {
		this.token = options.token;
		this.id = options.id;
		this.guildId = options.guildId;

		this.#client = new Client({
			intents: options.intents,
		});

		this.commandsPath = options.commandsPath;
		this.eventsPath = options.eventsPath;
		this.buttonsPath = options.buttonsPath;
	}

	get client() {
		return this.#client;
	}

	public async start(): Promise<void> {
		try {
			await eventHandler(this);
			if (this.guildId) await registerCommands(this, this.guildId);
			else await registerCommands(this);
			await registerComponents(this);
			await this.#client.login(this.token);
		} catch (error) {
			console.error("Failed to login:", error);
			process.exit(1);
		}
	}
}
