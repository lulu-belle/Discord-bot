const Discord = require("discord.js");
const { request } = require("graphql-request");
const _ = require("lodash");
const welcomePointListHelper = require("../../data/welcomePointListHelper");

exports.run = async (client, message, args) => {
  let url = "";
  let memArray = [];
  let welcomePointsArray = [];

  await message.guild.members.map(m => {
    memArray.push({
      username: m.user.username,
      id: `${m.user.id}`
    });
  });
  let query = `query {
      getUsers {
        guild_id user_id welcome_points
      }
    }`;

  try {
    let res = await request(url, query);
    for (let i in res.getUsers) {
      if (
        "welcome_points" in res.getUsers[i] &&
        res.getUsers[i].guild_id === message.guild.id &&
        res.getUsers[i].welcome_points > 0
      ) {
        let name = "";
        for (let j in memArray) {
          if (memArray[j].id === res.getUsers[i].user_id) {
            name = memArray[j].username;
          }
        }
        if (name.length > 0)
          welcomePointsArray.push({
            username: name,
            welcome_points: res.getUsers[i].welcome_points
          });
      }
    }
    welcomePointsArray = await _.orderBy(
      welcomePointsArray,
      ["welcome_points"],
      ["desc"]
    );

    let strg = "";
    let msgEmbed = new Discord.RichEmbed()
      .setAuthor("Welcome leaderboard")
      .setColor("#202225");

    if (_.size(welcomePointsArray) > 25) {
      let newWelcomePointsArray = _.take(welcomePointsArray, 25);

      for (i in newWelcomePointsArray) {
        strg += `**${welcomePointsArray[i].username} :** ${welcomePointsArray[i].welcome_points}\n`;
      }
      msgEmbed.setDescription(strg);
      message.channel.send(msgEmbed).then(async m => {
        await m.react("⬅️");

        await m.react("➡️");
        msgEmbed.setFooter(
          `Page 1 / ${Math.floor(Number(_.size(welcomePointsArray)) / 25) +
            1} | ${m.id}`
        );
        m.edit(msgEmbed);
        welcomePointListHelper.addMemberList(m.id, welcomePointsArray);
      });
    } else {
      for (i in welcomePointsArray) {
        strg += `**${welcomePointsArray[i].username} :** ${welcomePointsArray[i].welcome_points}\n`;
      }
      msgEmbed.setDescription(strg);

      message.channel.send(msgEmbed);
    }
  } catch (err) {
    console.error(err);
  }
};
