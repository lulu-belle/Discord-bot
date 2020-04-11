const Discord = require("discord.js");
const { request } = require("graphql-request");
const moment = require("moment");
const schedule = require("node-schedule");

exports.run = async (client, message, args) => {
  if (
    message.guild &&
    (message.member.hasPermission("BAN_MEMBERS") ||
      message.member._roles.includes("561303174846218398") ||
      message.member._roles.includes("568204471855743002") ||
      message.member._roles.includes("568206840551440386") ||
      message.member._roles.includes("662991865062359085") ||
      message.member._roles.includes("662991836234776626") ||
      message.member._roles.includes("663015607230529548"))
  ) {
    let embed = new Discord.RichEmbed()
      .setAuthor("Reminder help")
      .setDescription(
        `**Command**\n.remind #channel/@user xd message\n\nx : integer\nd : s/m/h/d (secondes/minutes/heures/days)\n\nE.g.\n.remind ${message.channel} 10m hii !\n.remind ${message.author} 55s hii again !`
      )
      .setColor("#202225");
    if (args[1] && args[1].toLowerCase() === "help") {
      message.channel.send(embed);
    } else if (args[1]) {
      let queryAddition = "";
      let channelId = "";
      if (
        message.mentions.members.first() &&
        message.mentions.members.first().user.id ===
          message.content.split(/ +/g)[1].replace(/([^0-9])/g, "")
      ) {
        queryAddition = `user_id: "${
          message.mentions.members.first().user.id
        }", dm_user: ${true}`;
      } else {
        channelId = args[1].replace(/([^0-9])/g, "");
        queryAddition = `channel_id: "${channelId}",  dm_user: ${false}`;
      }
      if (
        (message.mentions.members.first() ||
          channelId.length === 18 ||
          channelId.length === 19) &&
        args[2]
      ) {
        let timeDelay = args[2];
        let timeUnit = timeDelay.toLowerCase().replace(/([^a-z])/g, "");
        if (
          timeUnit === "s" ||
          timeUnit === "m" ||
          timeUnit === "h" ||
          timeUnit === "d"
        ) {
          let date = new Date();
          let newDateObj = moment(date)
            .add(timeDelay.replace(/([^0-9])/g, ""), timeUnit)
            .toDate();

          if (args[3]) {
            let msg = "";

            for (let i = 3; i < args.length; i++) {
              msg += `${args[i]} `;
            }

            let url = "";

            let query = `mutation {
                      addSchedules(guild_id: "${
                        message.guild.id
                      }", ${queryAddition}, message: "${msg}", date: "${moment(
              newDateObj
            )}") {
                          message
                      }
                    }`;
            try {
              await request(url, query);
              message.channel.send(`okay reminder set !`);
              schedule.scheduleJob(newDateObj, async () => {
                if (
                  message.mentions.members.first() &&
                  message.mentions.members.first().user.id ===
                    message.content.split(/ +/g)[1].replace(/([^0-9])/g, "")
                ) {
                  message.mentions.members.first().send(msg);
                } else {
                  let c = await message.guild.channels.get(channelId);
                  c.send(msg);
                }
              });
            } catch (err) {
              console.error(err);
            }
          } else {
            return message.channel.send(embed);
          }
        } else {
          return message.channel.send(embed);
        }
      } else {
        return message.channel.send(embed);
      }
    } else {
      return message.channel.send(embed);
    }
  } else {
    if (!message.guild) {
      message.channel.send("sorry but i do not do this command in dms !");
      return message.channel.send("<:natsukiMad:646210751417286656>");
    } else {
      message.channel.send(
        "You don't have the permissions to use this command !"
      );
      return message.channel.send("<:natsukiMad:646210751417286656>");
    }
  }
};
