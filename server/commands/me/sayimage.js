const { request } = require("graphql-request");
const snekfetch = require("snekfetch");
const Discord = require("discord.js");

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

      if (chan) {
        const { body: buffer } = await snekfetch.get(args[1]);
        const attachment = new Discord.Attachment(buffer, "image.png");
        chan.send(attachment);
      }
    } catch (err) {
      console.error(err);
    }
  }
};
