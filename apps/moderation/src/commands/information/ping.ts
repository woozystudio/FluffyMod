import { Command, CommandPayload } from "@moderation/framework";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";

export default class PingCommand extends Command<CommandPayload> {
	public constructor() {
		super({
			name: "ping",
			description: "Replies with the ping!",
			testMode: false,
		});
	}

	public async chatInput(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			content: `Bot latency: ${Date.now() - interaction.createdTimestamp}ms\nAPI latency: ${Math.round(
				interaction.client.ws.ping,
			)}ms`,
			flags: MessageFlags.Ephemeral,
		});
	}
}
