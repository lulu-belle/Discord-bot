const { model, Schema } = require("mongoose");

const reactionrolesSchema = new Schema({
  guild_id: String,
  channel_id: String,
  role_id: String,
  emote: String,
  message_id: String
});

module.exports = model("Reactionroles", reactionrolesSchema);
