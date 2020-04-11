const { request } = require("graphql-request");
const Discord = require("discord.js");
const randomColor = require("../../data/randomColor");

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
        let messageEmbed = new Discord.RichEmbed()
          .setColor(randomColor())
          .setImage(args[1]);
        chan.send(messageEmbed);
        setTimeout(() => {
          message.delete();
        }, 200);
      }
    } catch (err) {
      console.error(err);
    }
  }
};
