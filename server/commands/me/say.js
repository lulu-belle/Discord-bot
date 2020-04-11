const { request } = require("graphql-request");

exports.run = async (client, message, args) => {
  if (message.author.id == "157673412561469440") {
    let url = "";

    let query = `query {
                getDefaults{
                    guild_id channel_id
                }
            }`;
    try {
      let res = await request(url, query);
      let guild_id = res.getDefaults[0].guild_id;
      let channel_id = res.getDefaults[0].channel_id;

      let chan = await client.guilds.get(guild_id).channels.get(channel_id);

      let messageToSend = "";
      for (let k = 1; k < args.length; k++) {
        messageToSend += args[k] + " ";
      }
      if (chan) {
        chan.send(messageToSend).catch((err) => console.error(err));
        setTimeout(() => {
          message.delete();
        }, 200);
      }
    } catch (err) {
      console.error(err);
    }
  }
};
