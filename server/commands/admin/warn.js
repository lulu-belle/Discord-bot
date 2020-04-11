const Discord = require("discord.js");
const { request } = require("graphql-request");
const defaults = require("../../data/defaults");
const userMain = require("../../data/userMain");
const serverMain = require("../../data/serverMain");
const schedule = require("node-schedule");
const moment = require("moment");

exports.run = async (client, message, args) => {
  let url = "";

  if (!message.member.hasPermission("BAN_MEMBERS")) {
    message.channel.send(
      `How dare you ${message.author.username} !! You don't have the permissions to use this command!`
    );
    message.channel.send("<:natsukiMad:646210751417286656>");
  } else {
    args.shift();

    let member = null;

    if (!message.mentions.members.first()) {
      for (let i in args) {
        if (
          args[i].replace(/([^0-9])/g, "").length >= 17 &&
          args[i].replace(/([^0-9])/g, "").length <= 20
        ) {
          if (message.guild.members.has(args[i].replace(/([^0-9])/g, ""))) {
            member = message.guild.members.get(
              args[i].replace(/([^0-9])/g, "")
            );
            args.splice(i, 1);
            i--;
          } else {
            message.channel.send(
              "sorry but i cannot find any users with this id !"
            );
            return message.channel.send("<:kanna_confused:607077674099277828>");
          }
        }
      }
    } else {
      member = message.mentions.members.first();
      for (let i in args) {
        if (args[i].indexOf(message.mentions.members.first().user.id) > -1)
          args.splice(i, 1);
      }
    }

    if (member) {
      let user = userMain
        .get(message.guild.id)
        .users.find(id => id.user_id === member.user.id);
      let server = serverMain.get(message.guild.id);
      if (user) {
        let currentStrikes = user.strikes;

        let strikesAdding = 1;

        currentStrikes += strikesAdding;

        let c = await client.channels.get(server.mod_channel);

        if (currentStrikes > 5) {
          return message.channel.send(
            "they already have 5 warnings ! that is the max !!"
          );
        } else if (currentStrikes === 5) {
          let check = await addToDatabase(currentStrikes);
          if (check) {
            member
              .ban(
                `5 warnings (Last warning by: **${message.author.username}**#${message.author.discriminator})`
              )
              .catch(() =>
                message.channel.send("please give me banning permissions !!")
              );
            user.strikes = currentStrikes;
          } else {
            return message.channel.send(
              "sorry but i failed to give them a strike !"
            );
          }
        } else if (currentStrikes === 4) {
          let check = await addToDatabase(currentStrikes);
          if (check) {
            member
              .kick(
                `4 warnings (Last warning by: **${message.author.username}**#${message.author.discriminator})`
              )
              .catch(() =>
                message.channel.send("please give me kicking permissions !!")
              );
            user.strikes = currentStrikes;
          } else {
            return message.channel.send(
              "sorry but i failed to give them a strike !"
            );
          }
        } else if (currentStrikes === 3) {
          let check = await addToDatabase(currentStrikes);
          if (check) {
            if (server.muted_role) {
              member
                .addRole(server.muted_role)
                .then(() => {
                  if (c) c.send(mutedWarning(user.strikes, currentStrikes));
                  user.strikes = currentStrikes;
                  let date = new Date();
                  let newDateObj = moment(date)
                    .add(1, "h")
                    .toDate();
                  schedule.scheduleJob(newDateObj, async () => {
                    let memRoles = member._roles;
                    if (memRoles.includes(server.muted_role)) {
                      memRoles.splice(memRoles.indexOf(server.muted_role), 1);
                      member
                        .setRoles(memRoles)
                        .then(() => {
                          if (c)
                            c.send(
                              `**${member.user.username}**#${member.user.discriminator} has been unmuted due to the 1 hour being up`
                            );
                        })
                        .catch(() => {
                          message.channel.send(
                            "please give me modify role permissions !!"
                          );
                          user.strikes = currentStrikes;
                        });
                    }
                  });
                })
                .catch(() => {
                  message.channel.send(
                    "please give me modify role permissions !!"
                  );
                  user.strikes = currentStrikes;
                });
            } else {
              if (c)
                c.send(
                  `**${member.user.username}**#${member.user.discriminator} has 3 warnings but i was unable to mute them because i dont know what your muted role is !\nplease use the command **.setmutedrole** !!`
                );
              user.strikes = currentStrikes;
            }
          } else {
            return message.channel.send(
              "sorry but i failed to give them a strike !"
            );
          }
        } else {
          let check = await addToDatabase(currentStrikes);
          if (check) {
            message.channel.send(warningEmbed());
            if (c) c.send(modWarningmsg(user.strikes, currentStrikes));
            user.strikes = currentStrikes;
          } else {
            return message.channel.send(
              "sorry but i failed to give them a strike !"
            );
          }
        }
      }

      async function addToDatabase(strikes) {
        query = `mutation{
                addStrike(guild_id: "${message.guild.id}", user_id: "${member.user.id}", strikes: ${strikes}) {
                    strikes
                }
            }`;
        try {
          res = await request(url, query);
          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      }

      function warningEmbed() {
        let warningMsg = new Discord.RichEmbed()
          .setColor("#202225")
          .setFooter(
            `${message.guild.name}`,
            "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
          )
          .setTimestamp();

        if (args.length > 0) {
          let reason = args.join(" ").trim();
          if (reason.length > 0)
            warningMsg.setDescription(`**Reason :** ${reason}`);
          else warningMsg.setDescription(`**Reason :** - no reason provided -`);
        } else warningMsg.setDescription(`**Reason :** - no reason provided -`);

        if (member.user.avatarURL)
          warningMsg.setAuthor(
            `${member.user.username}#${member.user.discriminator} has been warned`,
            member.user.avatarURL
          );
        else
          warningMsg.setAuthor(
            `${member.user.username}#${member.user.discriminator} has been warned`
          );

        return warningMsg;
      }

      function mutedWarning(oldWarn, newWarn) {
        let warningMsg = new Discord.RichEmbed()
          .setAuthor("❌ Member muted for 1 hour")
          .setColor("#202225")
          .setFooter(
            `${message.guild.name}`,
            "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
          )
          .setTimestamp();

        if (args.length > 0) {
          let reason = args.join(" ").trim();
          if (reason.length > 0)
            warningMsg.setDescription(
              `**${message.author.username}**#${message.author.discriminator} has warned **${member.user.username}**#${member.user.discriminator} [${oldWarn} → ${newWarn}]\n(ID:${member.user.id})\n\n**Reason :** ${reason}`
            );
          else
            warningMsg.setDescription(
              `**${message.author.username}**#${message.author.discriminator} has warned **${member.user.username}**#${member.user.discriminator} [${oldWarn} → ${newWarn}]\n(ID:${member.user.id})\n\n**Reason :** - no reason provided -`
            );
        } else
          warningMsg.setDescription(
            `**${message.author.username}**#${message.author.discriminator} has warned **${member.user.username}**#${member.user.discriminator} [${oldWarn} → ${newWarn}]\n(ID:${member.user.id})\n\n**Reason :** - no reason provided -`
          );

        if (member.user.avatarURL)
          warningMsg.setThumbnail(member.user.avatarURL);

        return warningMsg;
      }

      function modWarningmsg(oldWarn, newWarn) {
        let warningMsg = new Discord.RichEmbed()
          .setAuthor("❌ Member warned")
          .setColor("#202225")
          .setFooter(
            `${message.guild.name}`,
            "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
          )
          .setTimestamp();

        if (args.length > 0) {
          let reason = args.join(" ").trim();
          if (reason.length > 0)
            warningMsg.setDescription(
              `**${message.author.username}**#${message.author.discriminator} has warned **${member.user.username}**#${member.user.discriminator} [${oldWarn} → ${newWarn}]\n(ID:${member.user.id})\n\n**Reason :** ${reason}`
            );
          else
            warningMsg.setDescription(
              `**${message.author.username}**#${message.author.discriminator} has warned **${member.user.username}**#${member.user.discriminator} [${oldWarn} → ${newWarn}]\n(ID:${member.user.id})\n\n**Reason :** - no reason provided -`
            );
        } else
          warningMsg.setDescription(
            `**${message.author.username}**#${message.author.discriminator} has warned **${member.user.username}**#${member.user.discriminator} [${oldWarn} → ${newWarn}]\n(ID:${member.user.id})\n\n**Reason :** - no reason provided -`
          );

        if (member.user.avatarURL)
          warningMsg.setThumbnail(member.user.avatarURL);

        return warningMsg;
      }
    }
  }
};
