const Discord = require("discord.js");
const serverMain = require("../data/serverMain");

module.exports = async (client, messageOld, messageNew) => {
  if (messageOld.channel.guild && messageOld.embeds.length === 0) {
    if (messageOld.content !== messageNew.content) {
      if (messageOld.guild && messageOld.channel.type === "text") {
        let server = serverMain.get(messageOld.guild.id);
        if (server && "message_log" in server && server.message_log) {
          let c = await messageOld.guild.channels.get(server.message_log);

          if (c) {
            let messageEmbed = new Discord.RichEmbed()
              .setColor("#ffff00")
              .setAuthor("Message edited")
              .setDescription(
                `⚠ **${messageOld.author.username}**#${messageOld.author.discriminator} (ID:${messageOld.author.id}) edited a message in ${messageOld.channel}\n**[► Message Original](https://discordapp.com/channels/${messageNew.channel.guild.id}/${messageOld.channel.id}/${messageNew.id})**\n\n**From : ** ${messageOld.content}\n**To :** ${messageNew.content}`
              )
              .setFooter(
                `${messageNew.channel.guild.name}`,
                "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
              )
              .setTimestamp();
            c.send(messageEmbed);
          }
        }
      }
    }
  }
};
