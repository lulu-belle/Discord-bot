const Discord = require("discord.js");
const _ = require("lodash");
const moment = require("moment");
const memberListHelper = require("../../data/memberListHelper");

exports.run = async (client, message, args) => {
  const formatDate = date => {
    moment.locale("fr");
    return moment(new Date(Number(date)).toISOString()).format("D MMM YYYY");
  };

  let memArray = [];

  await message.guild.members.map(m => {
    memArray.push({
      username: m.user.username,
      joinedTimestamp: m.joinedTimestamp
    });
  });

  memArray = await _.orderBy(memArray, ["joinedTimestamp"], ["asc"]);

  let strg = "";
  let msgEmbed = new Discord.RichEmbed()
    .setAuthor("Member join date")
    .setColor("#202225");

  if (_.size(memArray) > 25) {
    let newMemArray = _.take(memArray, 25);

    for (i in newMemArray) {
      strg += `${newMemArray[i].username} - ${formatDate(
        newMemArray[i].joinedTimestamp
      )}\n`;
    }
    msgEmbed.setDescription(strg);
    message.channel.send(msgEmbed).then(async m => {
      await m.react("⬅️");

      await m.react("➡️");
      msgEmbed.setFooter(
        `Page 1 / ${Math.floor(Number(_.size(memArray)) / 25) + 1} | ${m.id}`
      );
      m.edit(msgEmbed);
      memberListHelper.addMemberList(m.id, memArray);
    });
  } else {
    for (i in memArray) {
      strg += `${memArray[i].username} - ${formatDate(
        memArray[i].joinedTimestamp
      )}\n`;
    }
    msgEmbed.setDescription(strg);

    message.channel.send(msgEmbed);
  }
};
