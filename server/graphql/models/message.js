const { model, Schema } = require("mongoose");

const messageSchema = new Schema({
  guild_id: String,
  channel_id: String,
  channel_name: String,
  message_count: Number,
  day: String
});

module.exports = model("Message", messageSchema);
