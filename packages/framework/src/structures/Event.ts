import { ClientEvents } from "discord.js";
import { EventPayload } from "../types/Event.js";
import { ModerationClient } from "./ModerationClient.js";

export abstract class Event<
	C extends EventPayload,
	K extends keyof ClientEvents,
> {
	public readonly name: string;
	public readonly once?: boolean;
	public readonly description?: string;

	protected constructor(payload: C) {
		this.name = payload.name;
		this.once = payload.once;
		this.description = payload.description;
	}

	public abstract execute(
		client: ModerationClient,
		...args: ClientEvents[K]
	): Promise<void | unknown> | void;
}
