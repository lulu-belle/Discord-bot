const Discord = require("discord.js");
const urban = require("relevant-urban");
const randColour = require("../../data/randomColor");
const talkedRecently = new Set();

exports.run = async (client, message) => {
  if (
    talkedRecently.has("urban-called") &&
    message.author.id !== "157673412561469440" &&
    message.author.id !== "630573404352937996"
  ) {
    message.channel.send(
      "please not so fast !! I just need a little more time so i do not get banned from this site !!"
    );
    message.channel.send("<a:crying:661358360091688980>");
  } else {
    let query = message.content.replace(".urbandic ", "");
    message.channel.startTyping();
    let res = await urban.all(query.trim());
    if (res.length > 0) {
      let embed = new Discord.RichEmbed()
        .setAuthor(
          `${res[0].word}`,
          "https://cdn.discordapp.com/attachments/660228695730028594/677546966053552147/apple-touch-icon-1734beeaa059fbc5587bddb3001a0963670c6de8767afb6c67d88d856b0c0dad.png"
        )
        .setDescription(
          `**Top definiton :** ${res[0].definition.replace(
            /[^\w\s\.\!\,\*\?\"\'\:\;\=\#\$\&\(\)\t\n\r\€\£]/gi,
            ""
          )}\n**Example :** ${res[0].example.replace(
            /[^\w\s\.\!\,\*\?\"\'\:\;\=\#\$\&\(\)\t\n\r\€\£]/gi,
            ""
          )}`
        )
        .setColor(randColour())
        .setFooter(
          `${message.guild.name}`,
          "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
        )
        .setTimestamp();
      message.channel
        .send(embed)
        .then(() => message.channel.stopTyping(true))
        .catch(err => console.error(err));
      talkedRecently.add("urban-called");
      setTimeout(() => {
        talkedRecently.delete("urban-called");
      }, 45000);
    } else {
      message.channel
        .send(`sorry but i could not find anything for **${query.trim()}** !`)
        .then(() => message.channel.stopTyping(true))
        .catch(err => console.error(err));
      talkedRecently.add("urban-called");
      setTimeout(() => {
        talkedRecently.delete("urban-called");
      }, 45000);
    }
  }
};
