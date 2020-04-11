const { model, Schema } = require("mongoose");

const shipSchema = new Schema({
  guild_id: String,
  user_id: String,
  ship_id: String,
  timestamp: String //timestamp of ship start
});

module.exports = model("Ship", shipSchema);
