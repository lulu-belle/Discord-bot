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
      let messageEmbed = new Discord.RichEmbed();

      if (chan) {
        message.channel.send("what is the title ?").then(() => {
          message.channel
            .awaitMessages(res => res.author.id === message.author.id, {
              max: 1,
              time: 60000,
              errors: ["time"]
            })
            .then(collected => {
              messageEmbed.setAuthor(collected.first().content);
              message.channel.send("what is the description ?").then(() => {
                message.channel
                  .awaitMessages(res => res.author.id === message.author.id, {
                    max: 1,
                    time: 60000,
                    errors: ["time"]
                  })
                  .then(collected => {
                    messageEmbed.setDescription(collected.first().content);
                    message.channel.send("what colour ?").then(() => {
                      message.channel
                        .awaitMessages(
                          res => res.author.id === message.author.id,
                          {
                            max: 1,
                            time: 60000,
                            errors: ["time"]
                          }
                        )
                        .then(collected => {
                          if (
                            collected.first().content.toLowerCase() == "random"
                          ) {
                            messageEmbed.setColor(randomColor());
                          } else {
                            messageEmbed.setColor(collected.first().content);
                          }
                          chan.send(messageEmbed);
                        });
                    });
                  });
              });
            });
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
};
