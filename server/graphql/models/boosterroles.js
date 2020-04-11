const { model, Schema } = require("mongoose");

const boosterrolesSchema = new Schema({
  guild_id: String,
  user_id: String,
  role_id: String
});

module.exports = model("Boosterroles", boosterrolesSchema);
