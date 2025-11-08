import { model, Schema } from "mongoose";

const ticketSetup = new Schema({
	GuildID: String,
	ParentID: String,

	// TODO: Add description field for ticket purpose
});

export default model("ticketSetup", ticketSetup);
