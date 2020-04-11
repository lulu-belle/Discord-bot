const Message = require("../models/message");

module.exports = {
  Query: {
    getMessages: async (_, { guild_id }) => {
      try {
        //  Find all message counts
        const messages = await Message.find(
          { guild_id: guild_id },
          "guild_id channel_id channel_name message_count day"
        );
        return messages;
      } catch (err) {
        throw new Error(err);
      }
    },
    getMessage: async (_, { guild_id, channel_id, day }) => {
      const message = await Message.find(
        { guild_id: guild_id, channel_id: channel_id, day: day },
        "guild_id channel_id channel_name message_count day"
      );
      return message[0];
    }
  },
  Mutation: {
    addMessage: async (
      _,
      { guild_id, channel_id, channel_name, message_count, day }
    ) => {
      const newMessage = new Message({
        guild_id,
        channel_id,
        channel_name,
        message_count,
        day
      });

      //  Create the new message count
      const res = await newMessage.save();

      return res;
    },
    updateMessage: async (
      _,
      { guild_id, channel_id, channel_name, message_count, day }
    ) => {
      const res = await Message.findOneAndUpdate(
        {
          guild_id: guild_id,
          channel_id: channel_id,
          day: day
        },
        {
          channel_name: channel_name,
          message_count: message_count
        },
        {
          new: true
        }
      );

      return res;
    }
  }
};
