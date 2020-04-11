const Discord = require("discord.js");
const { request } = require("graphql-request");
const userMain = require("../../data/userMain");
const serverMain = require("../../data/serverMain");

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

        currentStrikes -= strikesAdding;

        let c = await client.channels.get(server.mod_channel);

        if (currentStrikes < 0) {
          return message.channel.send("they have 0 warnings silly !");
        } else {
          let check = await addToDatabase(currentStrikes);
          if (check) {
            message.channel.send(pardonEmbed(user.strikes, currentStrikes));
            user.strikes = currentStrikes;
          } else {
            return message.channel.send("sorry but i failed to pardon them !");
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

      function pardonEmbed(oldWarn, newWarn) {
        let pardonMsg = new Discord.RichEmbed()
          .setColor("#202225")
          .setFooter(
            `${message.guild.name}`,
            "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
          )
          .setTimestamp();

        if (args.length > 0) {
          let reason = args.join(" ").trim();
          if (reason.length > 0)
            pardonMsg.setDescription(
              `**Reason :** **${message.author.username}**#${message.author.discriminator} - ${reason}`
            );
          else
            pardonMsg.setDescription(
              `**Reason :** **${message.author.username}**#${message.author.discriminator} - no reason provided -`
            );
        } else
          pardonMsg.setDescription(
            `**Reason :** **${message.author.username}**#${message.author.discriminator} - no reason provided -`
          );

        if (member.avatarURL)
          pardonMsg.setAuthor(
            `${member.user.username}#${member.user.discriminator} has been pardoned [${oldWarn} → ${newWarn}]`,
            member.avatarURL
          );
        else
          pardonMsg.setAuthor(
            `${member.user.username}#${member.user.discriminator} has been pardoned [${oldWarn} → ${newWarn}]`
          );

        return pardonMsg;
      }
    }
  }
};
