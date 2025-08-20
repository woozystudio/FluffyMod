import fs from "fs";
import { pathToFileURL } from "url";
import { Event } from "../structures/Event.js";
import { fileCondition } from "./fileCondition.js";
import { ClientEvents } from "discord.js";
import { ModerationClient } from "../structures/ModerationClient.js";
import { EventPayload } from "../types/Event.js";

export async function getEvents(client: ModerationClient) {
  const localEvents: Event<EventPayload, keyof ClientEvents>[] = [];
  const eventsPath = client.eventsPath as string;

  const folders = fs.readdirSync(eventsPath);
  for (const folder of folders) {
    const files = fs
      .readdirSync(`${eventsPath}/${folder}`)
      .filter(fileCondition);

    for (const fileName of files) {
      const modulePath = pathToFileURL(
        `${eventsPath}/${folder}/${fileName}`
      ).href;
      const eventModule = await import(modulePath);
      const EventClass = eventModule.default;
      const event = new EventClass();
      localEvents.push(event);
    }
  }

  return localEvents;
}
