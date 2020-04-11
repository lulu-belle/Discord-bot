const { request } = require("graphql-request");
let url = "";

let messageCounter = (module.exports = {
  counts: [],
  addGuild: async (guild_id, channel_id, channel_name, day) => {
    let messageObj = {
      [guild_id]: {
        [channel_id]: {
          count: 1
        },
        day: day
      }
    };
    messageCounter.counts.push(messageObj);

    let query = `{
                getMessage(guild_id: "${guild_id}", channel_id: "${channel_id}", day: "${day}") {
                     message_count
                }
            }`;
    try {
      await request(url, query);
    } catch (err) {
      query = `mutation {
                addMessage(guild_id: "${guild_id}", channel_id: "${channel_id}", channel_name: "${channel_name}", message_count: 1, day: "${day}") {
                    guild_id channel_id message_count day
                }
            }`;
      try {
        await request(url, query);
      } catch (err) {
        console.error(err);
      }
    }
  },
  addChannel: async (guild_id, channel_id, channel_name, day, i) => {
    let messageObj = {
      count: 1
    };
    messageCounter.counts[i][guild_id][channel_id] = messageObj;

    let query = `mutation {
                addMessage(guild_id: "${guild_id}", channel_id: "${channel_id}", channel_name: "${channel_name}", message_count: 1, day: "${day}") {
                    guild_id channel_id message_count day
                }
            }`;
    try {
      await request(url, query);
    } catch (err) {
      console.error(err);
    }
  },
  addCount: async (guild_id, channel_id, channel_name, day, i) => {
    messageCounter.counts[i][guild_id][channel_id].count += 1;
    if (messageCounter.counts[i][guild_id][channel_id].count === 25) {
      let query = `{
                getMessage(guild_id: "${guild_id}", channel_id: "${channel_id}", day: "${day}") {
                     message_count
                }
            }`;
      try {
        let res = await request(url, query);

        query = `mutation{
                updateMessage(guild_id: "${guild_id}", channel_id: "${channel_id}", channel_name: "${channel_name}", message_count: ${parseInt(
          res.getMessage.message_count
        ) + 25} day: "${day}") {
                    guild_id channel_id message_count day
                }
            }`;
        try {
          await request(url, query);
        } catch (err) {
          console.error(err);
        }
      } catch (err) {
        console.error(err);
      }
    }
  },
  newDay: async (guild_id, channel_id, channel_name, oldDay, day, i) => {
    let query = `{
                getMessage(guild_id: "${guild_id}", channel_id: "${channel_id}", day: "${oldDay}") {
                    guild_id channel_id message_count day
                }
            }`;
    try {
      let res = await request(url, query);
      query = `mutation{
                updateMessage(guild_id: "${guild_id}", channel_id: "${channel_id}", channel_name: "${channel_name}", message_count: ${parseInt(
        res.getMessage.message_count
      ) + messageCounter.counts[i][guild_id][channel_id].count} day: "${
        res.getMessage.day
      }") {
                    guild_id channel_id message_count day
                }
            }`;
      try {
        res = await request(url, query);

        query = `mutation {
                addMessage(guild_id: "${guild_id}", channel_id: "${channel_id}", message_count: 1, day: "${day}") {
                    guild_id channel_id message_count day
                }
            }`;
        try {
          res = await request(url, query);
          messageCounter.counts[i][guild_id][channel_id].count = 1;
          messageCounter.counts[i][guild_id].day = day;
        } catch (err) {
          console.error(err);
        }
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
    }
  }
});
