const Reactionroles = require("../models/reactionroles");

module.exports = {
  Query: {
    getReactionRoles: async () => {
      try {
        const reactionroles = await Reactionroles.find();
        return reactionroles;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    addReactionRoles: async (
      _,
      { guild_id, channel_id, role_id, emote, message_id }
    ) => {
      const newReactionroles = new Reactionroles({
        guild_id,
        channel_id,
        role_id,
        emote,
        message_id
      });

      //  Create the new Reactionroles
      const res = await newReactionroles.save();
      return res;
    },
    deleteReactionRoles: async (
      _,
      { guild_id, channel_id, role_id, emote, message_id }
    ) => {
      const res = await Reactionroles.deleteOne({
        guild_id: guild_id,
        channel_id: channel_id,
        role_id: role_id,
        emote: emote,
        message_id: message_id
      });
      return res;
    }
  }
};
