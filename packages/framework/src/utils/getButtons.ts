import fs from "fs";
import { pathToFileURL } from "url";
import { fileCondition } from "./fileCondition.js";
import { ModerationClient } from "../structures/ModerationClient.js";
import { Button } from "../structures/Button.js";
import { ButtonPayload } from "../types/Components.js";

export async function getButtons(client: ModerationClient) {
	const localButtons: Button<ButtonPayload>[] = [];
	const buttonsPath = client.buttonsPath as string;

	const folders = fs.readdirSync(buttonsPath);
	for (const folder of folders) {
		const files = fs.readdirSync(`${buttonsPath}/${folder}`).filter(fileCondition);

		for (const fileName of files) {
			const modulePath = pathToFileURL(`${buttonsPath}/${folder}/${fileName}`).href;
			const buttonModule = await import(modulePath);
			const ButtonClass = buttonModule.default;
			const button = new ButtonClass();
			localButtons.push(button);
		}
	}

	return localButtons;
}
