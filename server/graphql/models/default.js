const { model, Schema } = require("mongoose");

const defaultSchema = new Schema({
  guild_id: String,
  channel_id: String,
  mod_channel_id: String,
  user_id: String
});

module.exports = model("Default", defaultSchema);
