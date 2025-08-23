import { ModerationClient } from "@moderation/framework";
import { GatewayIntentBits } from "discord.js";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const commandsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "commands");
const eventsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "events");
const buttonsPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "buttons");

const client = new ModerationClient({
	token: `${process.env.TOKEN}`,
	id: `${process.env.CLIENT_ID}`,
	guildId: `${process.env.GUILD_ID}`,
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],

	commandsPath: commandsPath,
	eventsPath: eventsPath,
	buttonsPath: buttonsPath,
});

client.start();
