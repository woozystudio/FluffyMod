import { model, Schema } from "mongoose";

const ticket = new Schema({
	GuildID: String,
	ID: String,
	TargetID: String,
	ChannelID: String,
	CreatedAt: Number,
	LockedAt: Number,
	Locked: Boolean,
	Closing: Boolean,

	// TODO: claim system and lock system
});

export default model("ticket", ticket);
