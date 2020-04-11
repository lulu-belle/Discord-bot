const User = require(`../models/users`);

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        //  Find all users
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
    getUser: async (_, { guild_id, user_id }) => {
      const user = await User.find(
        { guild_id: guild_id, user_id: user_id },
        "guild_id user_id join_date strikes booster booster_role custom_role welcome_points temp_role"
      );
      return user[0];
    },
    getBoosterRoles: async (_, { guild_id, booster }) => {
      const user = await User.find(
        { guild_id: guild_id, booster: booster },
        "guild_id user_id booster_role"
      );
      return user[0];
    }
  },
  Mutation: {
    addUser: async (
      _,
      { guild_id, user_id, join_date, strikes, booster, welcome_points }
    ) => {
      const newUser = new User({
        guild_id,
        user_id,
        join_date,
        strikes,
        booster,
        welcome_points
      });

      //  Create the new user
      const res = await newUser.save();

      return res;
    },
    addStrike: async (_, { guild_id, user_id, strikes }) => {
      const res = await User.findOneAndUpdate(
        {
          guild_id: guild_id,
          user_id: user_id
        },
        {
          strikes: strikes
        },
        {
          new: true
        }
      );

      return res;
    },
    setBooster: async (_, { guild_id, user_id, booster }) => {
      const res = await User.findOneAndUpdate(
        {
          guild_id: guild_id,
          user_id: user_id
        },
        {
          booster: booster
        },
        {
          new: true
        }
      );

      return res;
    },
    addWelcomePoints: async (_, { guild_id, user_id, welcome_points }) => {
      const res = await User.findOneAndUpdate(
        {
          guild_id: guild_id,
          user_id: user_id
        },
        {
          welcome_points: welcome_points
        },
        {
          new: true
        }
      );

      return res;
    },
    setTempRole: async (_, { guild_id, user_id, temp_role }) => {
      const res = await User.findOneAndUpdate(
        {
          guild_id: guild_id,
          user_id: user_id
        },
        {
          temp_role: temp_role
        },
        {
          new: true
        }
      );

      return res;
    },
    setBoosterRole: async (_, { guild_id, user_id, booster_role }) => {
      const res = await User.findOneAndUpdate(
        {
          guild_id: guild_id,
          user_id: user_id
        },
        {
          booster_role: booster_role
        },
        {
          new: true
        }
      );

      return res;
    },
    setCustomRole: async (_, { guild_id, user_id, custom_role }) => {
      const res = await User.findOneAndUpdate(
        {
          guild_id: guild_id,
          user_id: user_id
        },
        {
          custom_role: custom_role
        },
        {
          new: true
        }
      );

      return res;
    }
  }
};
