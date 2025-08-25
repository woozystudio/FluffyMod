import { model, Schema } from "mongoose";

const roleSetup = new Schema({
	GuildID: String,
	RoleID: String,
});

export default model("roleSetup", roleSetup);
