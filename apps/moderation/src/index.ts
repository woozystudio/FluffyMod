import { ModerationClient } from "@moderation/framework";
import { GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { connect } from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const commandsPath = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"commands",
);
const eventsPath = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"events",
);

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
});

await connect(`${process.env.MONGODB_URI}`, { appName: "moderation-v1" }).then(() => {
	console.log("☁️ Connected to MongoDB database.");
});

client.start();
