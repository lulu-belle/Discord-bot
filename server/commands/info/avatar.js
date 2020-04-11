const Discord = require("discord.js");
const randomColor = require("../../data/randomColor");

exports.run = async (client, message, args) => {
  let messageEmbed = new Discord.RichEmbed()
    .setColor(randomColor())
    .setTimestamp();

  if (!args[1]) {
    messageEmbed
      .setTitle(`Here is your avatar ${message.author.username} !!`)
      .setImage(message.author.displayAvatarURL);

    message.channel.send(messageEmbed);
  } else {
    let member = null;
    if (!message.mentions.members.first()) {
      let id = args[1].replace(/([<>@,#!&])/g, "");
      try {
        member = await message.guild.fetchMember(id);
      } catch {
        message.channel.send("I don't think this member exists in the guild");
        message.channel.send("<:kanna_confused:607077674099277828>");
        return;
      }
    } else {
      member =
        message.mentions.members.first() || message.guild.members.get(args[1]);
    }
    // message.channel.send(member.user.displayAvatarURL);

    messageEmbed
      .setTitle(
        `${message.author.username} wanted to see the avatar of ${member.user.username} !!`
      )
      .setImage(member.user.displayAvatarURL)
      .setFooter(
        `${message.guild.name}`,
        "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
      )
      .setTimestamp();

    message.channel.send(messageEmbed);
    // setTimeout(() => {
    //   message
    //     .delete()
    //     .catch(() =>
    //       message.channel.send(
    //         "I dont have the permission to delete the command message!"
    //       )
    //     );
    // }, 200);
  }
};
