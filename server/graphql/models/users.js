const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  guild_id: String,
  user_id: String,
  join_date: String,
  strikes: Number,
  booster: Boolean,
  booster_role: String,
  custom_role: String,
  welcome_points: Number,
  temp_role: String
});

module.exports = model("User", userSchema);
