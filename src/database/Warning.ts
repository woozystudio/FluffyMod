import { model, Schema } from "mongoose";

const warning = new Schema({
	GuildID: String,
	TargetID: String,
	TargetUsername: String,
	ModeratorID: String,
	ModeratorUsername: String,
	Reason: String,
	CreatedAt: Number,
	ID: Number,

	// Add case ID for reference to related cases
});

export default model("warning", warning);
