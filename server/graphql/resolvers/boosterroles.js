const Boosterroles = require(`../models/boosterroles`);

module.exports = {
  Query: {
    // getBoosterroles: async () => {
    //   try {
    //     //  Find all users
    //     const boosterroles = await Boosterroles.find();
    //     console.log(boosterroles);
    //     return boosterroles;
    //   } catch (err) {
    //     throw new Error(err);
    //   }
    // }
  },
  Mutation: {
    // addBoosterroles: async (_, { guild_id, user_id, role_id }) => {
    //   const newBoosterroles = new Boosterroles({
    //     guild_id,
    //     user_id,
    //     role_id
    //   });
    //   try {
    //     //  Create the new user
    //     const res = await newBoosterroles.save();
    //     console.log(res);
    //     return res;
    //   } catch (err) {
    //     console.error(err);
    //   }
    // },
    // deleteBoosterroles: async (_, { role_id }) => {
    //   const res = await Boosterroles.deleteOne({
    //     role_id: role_id
    //   });
    //   console.log("resolver", res);
    //   return res;
    // }
  }
};
