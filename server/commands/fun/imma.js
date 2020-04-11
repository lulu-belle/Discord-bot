const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (
    message.channel.id === "561453542741901322" &&
    message.author.id !== "157673412561469440" &&
    message.author.id !== "630573404352937996"
  ) {
    message.channel
      .send("sorry but i'm not allowed in here anymore !")
      .catch(err => {
        console.error(err);
      });
    message.channel.send("<a:crying:661358360091688980>").catch(err => {
      console.error(err);
    });
  } else {
    let messageEmbed = new Discord.RichEmbed()
      .setColor("#202225")
      .setImage(
        "https://cdn.discordapp.com/attachments/660228695730028594/666765186975137830/testing.gif"
      )
      .setFooter(
        `${message.guild.name}`,
        "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
      )
      .setTimestamp();
    message.channel.send(messageEmbed).catch(err => {
      console.error(err);
    });
  }
};
