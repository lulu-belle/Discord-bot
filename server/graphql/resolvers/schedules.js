const Schedules = require(`../models/schedules`);

module.exports = {
  Query: {
    getSchedules: async () => {
      try {
        //  Find all users
        const schedules = await Schedules.find();
        return schedules;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    addSchedules: async (
      _,
      { guild_id, channel_id, user_id, dm_user, message, date }
    ) => {
      const newSchedules = new Schedules({
        guild_id,
        channel_id,
        user_id,
        dm_user,
        message,
        date
      });
      try {
        //  Create the new user
        const res = await newSchedules.save();

        return res;
      } catch (err) {
        console.error(err);
      }
    },
    deleteSchedules: async (_, { guild_id, message, date }) => {
      const res = await Schedules.deleteOne({
        guild_id: guild_id,
        message: message,
        date: date
      });

      return res;
    }
  }
};
