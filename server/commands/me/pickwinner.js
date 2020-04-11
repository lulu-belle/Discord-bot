const Discord = require("discord.js");
let randomNum = require("../../data/randomNumber");

exports.run = async (client, message, args) => {
  if (message.guild && message.guild.id === "559560674246787087")
    if (message.author.id === "601825955572350976") {
      let giveawayRoleId = null;
      await Promise.all(
        message.guild.roles.map(r => {
          if (r.name === "Giveaways") giveawayRoleId = r.id;
        })
      );
      let members = await message.guild.fetchMembers();

      let memberArrayJoined = [];

      await Promise.all(
        members.members.map(async mem => {
          if (mem._roles.includes(giveawayRoleId)) {
            if (!mem._roles.includes("561302712470208513")) {
              memberArrayJoined.push(mem);
            }
          }
        })
      );

      let winner =
        memberArrayJoined[randomNum(0, memberArrayJoined.length - 1)];
      let c = await client.channels.get("617170232460443667");

      const embedPublic = new Discord.RichEmbed()
        .setAuthor("Giveaway Winner")
        .setDescription(
          `\n🎉 **${winner.user.username}** has won the giveaway !!\n\nMake sure to send them lots of love and congratulations !`
        )
        .setThumbnail(winner.user.avatarURL)
        .setColor("#f5acba");

      await c.send(embedPublic);

      const embedDm = new Discord.RichEmbed()
        .setAuthor(`🎉 Congrats 🎉`)
        .setDescription(
          `You won the giveaway !!\n\nMake sure to pick out a name and a hex-code for the coulour !\nThen use the command **.setwinnerrole** in here or anywhere in the serveur to get your custom role !`
        )
        .setColor("#f5acba");

      await winner.send(embedDm);
      await winner.addRole("676621473196277768");
      return;
    } else {
      return;
    }
};
