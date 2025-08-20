import { BitFieldResolvable, GatewayIntentsString } from "discord.js";

export type ModerationClientOptions = {
  token: string;
  id: string;
  guildId?: string;
  intents: BitFieldResolvable<GatewayIntentsString, number>;

  commandsPath?: string;
  eventsPath?: string;
};
