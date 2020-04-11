const { model, Schema } = require("mongoose");

const schedulesSchema = new Schema({
  guild_id: String,
  channel_id: String,
  user_id: String,
  dm_user: Boolean,
  message: String,
  date: String
});

module.exports = model("Schedules", schedulesSchema);
