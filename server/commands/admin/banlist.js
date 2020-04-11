const Discord = require("discord.js");
const _ = require("lodash");
const randomColor = require("../../data/randomColor");

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("BAN_MEMBERS")) {
    message.channel.send(
      "You don't have the permissions to use this command !"
    );
    message.channel.send("<:natsukiMad:646210751417286656>");
  } else {
    message.guild.fetchBans(true).then(bans => {
      let messageEmbed = new Discord.RichEmbed()
        .setColor(randomColor())
        .setTitle("**Ban List**");

      let bansArray = [];
      bans.map(ban => bansArray.push(ban));
      let chunkedBansArray = _.chunk(bansArray, 20);

      if (_.size(bansArray) > 20) {
        if (!args[1]) {
          message.channel.send(
            `there's soo many bans!! please use .banlist 1-${_.size(
              chunkedBansArray
            )}`
          );
        } else {
          if (args[1] >= 0 && args[1] <= _.size(bansArray) - 1) {
            messageEmbed.setFooter(
              `List ${args[1]}/${_.size(chunkedBansArray)}`
            );
            _.forEach(chunkedBansArray[args[1] - 1], user => {
              let reason = user.reason ? user.reason : "-no reason specified-";
              // let lastMessage = user.user.lastMessage ?
              //   timeConverter(user.user.lastMessage.createdTimestamp) :
              //   "[cannot find last message]";
              messageEmbed.addField(
                `${user.user.username}#${user.user.discriminator}`,
                `\`ID:\` ${user.user.id}\n\`Reason:\`\t${reason}`,
                true
              );
            });
          }
        }
      } else {
        _.forEach(bansArray, user => {
          let reason = user.reason ? user.reason : "-no reason specified-";
          // let lastMessage = user.user.lastMessage ?
          //   timeConverter(user.user.lastMessage.createdTimestamp) :
          //   "[cannot find last message]";
          messageEmbed.addField(
            `${user.user.username}#${user.user.discriminator}`,
            `\`ID:\` ${user.user.id}\n\`Reason:\`\t${reason}`,
            true
          );
        });
      }
      setTimeout(() => {
        message
          .delete()
          .catch(() =>
            message.channel.send(
              "I dont have the permission to delete the command message !"
            )
          );
      }, 200);
      message.channel.send(messageEmbed);
    });
  }
};
