const { model, Schema } = require("mongoose");

const serverSchema = new Schema({
  guild_id: String,
  muted_role: String,
  mod_channel: String,
  raid_mode: Boolean,
  raid_mode_active: Boolean,
  blank_avatar: Boolean,
  join_age: Boolean,
  new_member_roles: [String],
  message_log: String,
  mention_limit: Boolean,
  mention_amount: Number,
  emote_limit: Boolean,
  emote_amount: Number,
  everyone_warn: Boolean,
  anti_referral: Boolean,
  anti_invite: Boolean,
  dup_watch: Boolean,
  dup_limit: Number
});

module.exports = model("Server", serverSchema);
