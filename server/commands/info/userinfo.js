const Discord = require("discord.js");
const _ = require("lodash");
// const timeConverter = require("../../data/timeConverter");
// const timeDifference = require("../../data/timeDifference");
const randomColor = require("../../data/randomColor");
const moment = require("moment");

exports.run = async (client, message, args) => {
  let member = null;
  if (!args[1]) {
    try {
      member = await message.guild.fetchMember(message.author.id);
    } catch {
      message.channel.send("I don't think this member exists in the guild");
      message.channel.send("<:kanna_confused:607077674099277828>");
    }
  } else {
    if (!message.mentions.members.first()) {
      const id = args[1].replace(/([<>@,#!&])/g, "");
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
  }
  moment.locale("fr");
  let serverJoinDateDiff = moment.duration(
    moment(new Date().toISOString()).diff(
      moment(new Date(member.joinedTimestamp).toISOString())
    )
  );
  let discordJoinDateDiff = moment.duration(
    moment(new Date().toISOString()).diff(
      moment(new Date(member.user.createdTimestamp).toISOString())
    )
  );
  let serverJoinDate = moment(
    new Date(member.joinedTimestamp).toISOString()
  ).format("D MMM YYYY [à] H:mm");

  let discordJoinDate = moment(
    new Date(member.user.createdTimestamp).toISOString()
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
    if (dateObj.years === 0 && dateObj.months === 0 && dateObj.days === 0) {
      if (dateObj.hours !== 0) {
        string += `${dateObj.hours} heures `;
      }
      if (dateObj.minutes !== 0) {
        string += `${dateObj.minutes} minutes `;
      }
      if (dateObj.seconds !== 0) {
        string += `${dateObj.seconds} secondes `;
      }
    }
    return string;
  };

  let rolesArray = [];
  member.roles.map(r => rolesArray.push(r));
  rolesArray.shift();
  let formattedRoles = _.orderBy(rolesArray, "position", "desc");
  let rolesString = _.join(formattedRoles, " | ");
  let messageEmbed = new Discord.RichEmbed()
    .setColor(randomColor())
    .setTitle(`${member.user.username}#${member.user.discriminator}`)
    .setThumbnail(member.user.displayAvatarURL)
    .setDescription(member)
    .addField("ID", member.user.id, true)
    .addField("Presence", member.presence.status, true)
    .addField(
      "Account Creation",
      `${discordJoinDate}\n${formatDateDiff(discordJoinDateDiff._data)}`,
      true
    )
    .addField(
      "Server Join Date",
      `${serverJoinDate}\n${formatDateDiff(serverJoinDateDiff._data)}`,
      true
    )
    .addField(
      "Nickname on Server",
      member.nickname ? member.nickname : "No nickname set",
      true
    )
    .setFooter(
      `${message.guild.name}`,
      "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
    )
    .setTimestamp();

  if (member.user.lastMessage) {
    messageEmbed.addField(
      "Last Seen",
      `${member.user.lastMessage.channel}\n${moment(
        new Date(member.user.lastMessage.createdTimestamp).toISOString()
      ).format("D MMM YYYY [at] H:mm")}`,
      true
    );
  }
  messageEmbed.addField("Roles", rolesString);

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
};
