import { model, Schema } from "mongoose";

const reportSetup = new Schema({
	GuildID: String,
	ChannelID: String,
});

export default model("reportSetup", reportSetup);
