const { model, Schema } = require("mongoose");

const countSchema = new Schema({
  guild_id: String,
  members: Number,
  timestamp: String
});

module.exports = model("Count", countSchema);
