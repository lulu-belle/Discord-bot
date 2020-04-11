const Discord = require("discord.js");
const serverMain = require("../../data/serverMain");

exports.run = async (client, message, args) => {
  let server = serverMain.get(message.guild.id);

  if (
    !message.member.hasPermission("KICK_MEMBERS") &&
    message.author.id !== "283061927121256449" &&
    message.author.id !== "538026019681075220"
  ) {
    message.channel.send(
      `How dare you ${message.author.username} !! You don't have the permissions to use this command !`
    );
    message.channel.send("<:natsukiMad:646210751417286656>");
  } else {
    if (server.muted_role) {
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
            message.channel.send(
              "I don't think this member exists in the guild"
            );
            message.channel.send("<:kanna_confused:607077674099277828>");
          }
        } else {
          member =
            message.mentions.members.first() ||
            message.guild.members.get(args[1]);
        }

        if (member._roles.includes(server.muted_role)) {
          return message.channel.send(`they are already muted silly !`);
        } else {
          member.addRole(server.muted_role).then(async () => {
            message.channel.send("okay i muted them !");

            let reason = "";

            if (args[2]) {
              for (let i = 2; i < args.length; i++) {
                reason += `${args[i]} `;
              }
            } else reason = "- no reason provided -";

            let embed = new Discord.RichEmbed()
              .setAuthor("Member muted")
              .setDescription(
                `🔇 **${message.author.username}**#${
                  message.author.discriminator
                } muted **${member.user.username}**#${
                  member.user.discriminator
                } (ID:${member.user.id})\n\n**Reason :** ${reason.trim()}`
              )
              .setColor("#202225")
              .setFooter(
                `${message.guild.name}`,
                "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
              )
              .setTimestamp();

            if (member.user.avatarURL)
              embed.setThumbnail(member.user.avatarURL);

            let c = await member.guild.channels.get(server.mod_channel);
            if (c) c.send(embed);
          });
        }
      }
    } else {
      return message.channel.send(
        "there is no muted role set !! please add one with the command **.setmutedrole** !!"
      );
    }
  }
};
