import { CommandPayload } from "@moderation/framework";

export const pingCommand: CommandPayload = {
  name: "ping",
  description: "Replies with the ping!",
  testMode: true,
};
