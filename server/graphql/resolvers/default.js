const Default = require("../models/default");

module.exports = {
  Query: {
    getDefaults: async () => {
      try {
        //  Find all defaults
        const defaults = await Default.find();
        return defaults;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    setDefault: async (
      _,
      { guild_id, channel_id, mod_channel_id, user_id }
    ) => {
      const res = await Default.findOneAndUpdate(
        {
          user_id: user_id
        },
        {
          guild_id: guild_id,
          channel_id: channel_id,
          mod_channel_id: mod_channel_id
        },
        {
          new: true
        }
      );

      return res;
    }
  }
};
