import { Command, CommandPayload } from "botten";
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import Warning from "../../database/Warning.js";

export default class WarningsCommand extends Command<CommandPayload> {
	constructor() {
		super({
			name: "warnings",
			description: "Check the warnings of a server user.",
			userPermissions: [PermissionFlagsBits.ModerateMembers],
			options: [
				{
					name: "target",
					description: "Select a server user.",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: "id",
					description: "The ID of the warning.",
					type: ApplicationCommandOptionType.Number,
					required: false,
				},
			],
			testMode: true,
		});
	}

	override async chatInput(interaction: ChatInputCommandInteraction) {
		const target = interaction.options.getUser("target", true);
		const warningId = interaction.options.getNumber("id");

		const warningID = await Warning.findOne({
			GuildID: interaction.guild!.id,
			TargetID: target.id,
			where: { id: warningId },
		});

		console.log(warningID);

		// Missing code here for this system to be fully functional
		await interaction.reply({ content: `This command is still being developed.`, ephemeral: true });
	}
}
