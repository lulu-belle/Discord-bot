const Discord = require("discord.js");
const _ = require("lodash");
const randomColor = require("../../data/randomColor");

exports.run = async (client, message, args) => {
  if (!args[1]) {
    message.channel.send("there's no user specified!!!");
    message.channel.send("<:natsukiMad:646210751417286656>");
  } else {
    let member = null;
    if (!message.mentions.members.first()) {
      let id = args[1].replace(/([<>@,#!&])/g, "");
      try {
        member = await message.guild.fetchMember(id);
      } catch {
        message.channel.send("I don't think this member exists in the guild");
        message.channel.send("<:kanna_confused:607077674099277828>");
      }
    } else {
      member =
        message.mentions.members.first() ||
        message.guild.members.get(args[1]) ||
        message.member;
    }
    let rolesArray = [];
    member.roles.map(r => rolesArray.push(r));
    rolesArray.shift();
    let formattedRoles = _.orderBy(rolesArray, "position", "desc");
    let rolesString = _.join(formattedRoles, " | ");
    let messageEmbed = new Discord.RichEmbed()
      .setColor(randomColor())
      .setTitle(`${member.user.username}#${member.user.discriminator}`)
      .setThumbnail(member.user.displayAvatarURL)
      .addField("Roles", rolesString)
      .setFooter(
        `${message.guild.name}`,
        "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
      )
      .setTimestamp();
    message.channel.send(messageEmbed);
    setTimeout(() => {
      message
        .delete()
        .catch(() =>
          message.channel.send(
            "I dont have the permission to delete the command message!"
          )
        );
    }, 200);
  }
};
