import { model, Schema } from "mongoose";

const report = new Schema({
	GuildID: String,
	ID: String,
	AuthorID: String,
	TargetID: String,
	Reason: String,
	CreatedAt: Number,
	Closed: Boolean,
	ClosedBy: String,
});

export default model("report", report);
