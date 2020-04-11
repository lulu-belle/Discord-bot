const Count = require("../models/count");

module.exports = {
  Query: {
    getCount: async (_, { guild_id }) => {
      try {
        const counts = await Count.find(
          { guild_id: guild_id },
          "members timestamp"
        );
        return counts;
      } catch (err) {
        throw new Error(err);
      }
    },
    getCounts: async () => {
      try {
        const counts = await Count.find();
        return counts;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    addCount: async (_, { guild_id, members, timestamp }) => {
      const newCount = new Count({
        guild_id,
        members,
        timestamp
      });

      //  Create the new user
      const res = await newCount.save();

      return res;
    }
  }
};
