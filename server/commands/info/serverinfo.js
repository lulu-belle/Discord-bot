const Discord = require("discord.js");
const _ = require("lodash");
// const timeConverter = require("../../data/timeConverter");
// const timeDifference = require("../../data/timeDifference");
const randomColor = require("../../data/randomColor");
const moment = require("moment");

exports.run = async (client, message, args) => {
  let messageEmbed = new Discord.RichEmbed()
    .setColor(randomColor())
    .setFooter(
      `${message.guild.name}`,
      "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
    )
    .setTimestamp();

  let embedFilled = false;

  let channelArray = [],
    emojiArray = [],
    roleArray = [],
    memberArray = [];

  moment.locale("fr");
  let serverCreationDateDiff = moment.duration(
    moment(new Date().toISOString()).diff(
      moment(new Date(message.guild.createdTimestamp).toISOString())
    )
  );
  let serverCreationDate = moment(
    new Date(message.guild.createdTimestamp).toISOString()
  ).format("D MMM YYYY [à] H:mm");

  const formatDateDiff = dateObj => {
    let string = "il y a ";
    if (dateObj.years !== 0) {
      string += `${dateObj.years} ans `;
    }
    if (dateObj.months !== 0) {
      string += `${dateObj.months} mois `;
    }
    if (dateObj.days !== 0) {
      string += `${dateObj.days} jours `;
    }
    return string;
  };

  let i = 0;

  await message.guild.members.map(member => {
    if (member.roles.find(r => r.name === "Nitro Booster")) {
      i++;
    }
  });

  if (!args[1]) {
    message.guild.channels.map(chan => channelArray.push(chan));
    let channelCategory = _.countBy(channelArray, "type");
    message.guild.emojis.map(emoji => emojiArray.push(emoji));
    message.guild.roles.map(role => roleArray.push(role));
    message.guild.members.map(member => memberArray.push(member));
    let memberUserOrBot = _.countBy(memberArray, "user.bot"); // false = user / true = bot

    messageEmbed.setTitle(message.guild.name);
    messageEmbed.setThumbnail(message.guild.iconURL);
    messageEmbed.addField("ID", message.guild.id, true);
    messageEmbed.addField("Owner", message.guild.owner, true);
    messageEmbed.addField(
      "Creation Date",
      `${serverCreationDate}\n${formatDateDiff(serverCreationDateDiff._data)}`,
      true
    );
    messageEmbed.addField("Region", message.guild.region, true);
    messageEmbed.addField(
      "Member Count",
      message.guild.memberCount - memberUserOrBot.true,
      true
    );
    messageEmbed.addField(
      "Bot Count",
      message.guild.memberCount - memberUserOrBot.false,
      true
    );
    messageEmbed.addField("Categories", channelCategory.category, true);
    messageEmbed.addField("Text Channels", channelCategory.text, true);
    messageEmbed.addField("Voice Channels", channelCategory.voice, true);
    messageEmbed.addField("Emojis", emojiArray.length, true);
    messageEmbed.addField("Roles", roleArray.length, true);
    messageEmbed.addField("Boosts", `${i} minimum`, true);
    embedFilled = true;
  } else {
    let guildId = client.guilds.get(args[1]);
    if (guildId) {
      guildId.channels.map(chan => channelArray.push(chan));
      let channelCategory = _.countBy(channelArray, "type");
      guildId.emojis.map(emoji => emojiArray.push(emoji));
      guildId.roles.map(role => roleArray.push(role));
      guildId.members.map(member => memberArray.push(member));
      let memberUserOrBot = _.countBy(memberArray, "user.bot"); // false = user / true = bot

      messageEmbed.setTitle(guildId.name);
      messageEmbed.setThumbnail(guildId.iconURL);
      messageEmbed.addField("ID", guildId.id, true);
      messageEmbed.addField("Owner", guildId.owner, true);
      messageEmbed.addField(
        "Creation Date",
        messageEmbed.addField(
          "Creation Date",
          `${serverCreationDate}\nil y a ${formatDateDiff(
            serverCreationDateDiff
          )}`,
          true
        )
      );
      messageEmbed.addField("Region", guildId.region, true);
      messageEmbed.addField(
        "Member Count",
        guildId.memberCount - memberUserOrBot.true,
        true
      );
      messageEmbed.addField(
        "Bot Count",
        guildId.memberCount - memberUserOrBot.false,
        true
      );
      messageEmbed.addField("Categories", channelCategory.category, true);
      messageEmbed.addField("Text Channels", channelCategory.text, true);
      messageEmbed.addField("Voice Channels", channelCategory.voice, true);
      messageEmbed.addField("Emojis", emojiArray.length, true);
      messageEmbed.addField("Roles", roleArray.length, true);
      embedFilled = true;
    } else {
      message.channel.send("I'm not a member of this server");
      message.channel.send("<:deadinside:606350795881054216>");
    }
  }

  if (embedFilled) {
    message.channel.send(messageEmbed);
  }

  // setTimeout(() => {
  //   message
  //     .delete()
  //     .catch(() =>
  //       message.channel.send(
  //         "I dont have the permission to delete the command message!"
  //       )
  //     );
  // }, 200);
};
