const Discord = require("discord.js");
const randomNumber = require("../../data/randomNumber");
// const serverMain = require("../../data/serverMain");

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("BAN_MEMBERS")) {
    if (
      message.guild.id === "559560674246787087" &&
      message.channel.id !== "561453542741901322"
    ) {
      let randomNum = randomNumber(1, 300);
      if (randomNum === 300) {
        let member = null;
        message.channel.send("lucky number 300 !");

        if (!message.mentions.members.first()) {
          message.channel.send("you did not mention anyone !!!");
          message.channel.send("<:natsukiMad:646210751417286656>");
          return;
        }

        if (!member.bannable) {
          message.channel.send("I cannot ban this user !");
          message.channel.send("<a:sataniacrying:575078717911597077>");
          return;
        }

        message.channel.send(
          `lucky number 300 !! you are getting banned ${member}!\nyou have 10 secondes until you get banned !`
        );
        message.channel.send("<:oh_my:606353903558066176>");
        setTimeout(() => {
          member.send(
            `${message.author.username} has banned you, here is a invite link`
          );
          member.send("https://discord.gg/TTVdzRE");
          let memberId = member.user.id;
          member
            .ban("they lost the roulette")
            .then(() => {
              let messageEmbed = new Discord.RichEmbed()
                .setColor("#fe6860")
                .setTitle(
                  `${member.user.tag} has been banned by ${message.author.tag}`
                )
                .addField("Reason", "they lost the roulette")
                .setTimestamp();

              message.channel.send(messageEmbed);
              message.guild.unban(memberId);
            })
            .catch(error => {
              message.channel.send(
                `Sorry ${message.author} I couldn't ban the user`
              );
              message.channel.send("<:deadinside:606350795881054216>");
            });
        }, 10000);
      } else if (randomNum === 1) {
        message.channel.send(
          `unlucky number 1 !! you are getting banned ${message.author.username}! you have 10 secondes until you get banned !`
        );
        message.channel.send("<:oh_my:606353903558066176>");
        setTimeout(() => {
          message.author.send("you banned youself, here is a invite link");
          message.author.send("https://discord.gg/TTVdzRE");
          let memberId = message.author.id;

          message.author
            .ban("they lost the roulette")
            .then(() => {
              let messageEmbed = new Discord.RichEmbed()
                .setColor("#fe6860")
                .setTitle(
                  `${message.author.tag} has been banned by ${message.author.tag}`
                )
                .addField("Reason", "they lost the roulette")
                .setTimestamp();

              message.channel.send(messageEmbed);
              message.guild.unban(memberId);
            })
            .catch(error => {
              message.channel.send(
                `Sorry ${message.author} I couldn't ban the user`
              );
              message.channel.send("<:deadinside:606350795881054216>");
            });
        }, 10000);
      } else {
        message.channel.send(`you got ${randomNum} ! how lame !`);
        // message.channel.send(
        //   `How dare you ${message.author.username} !! You don't have the permissions to use this command!`
        // );
        message.channel.send("<:natsukiMad:646210751417286656>");
      }
    } else {
      if (message.channel.id === "561453542741901322") {
        message.channel.send(`please use me in a different channel !`);
        message.channel.send("<:natsukiMad:646210751417286656>").then(msg => {
          message.channel
            .awaitMessages(res => res.author.id === message.author.id, {
              max: 2,
              time: 20000,
              errors: ["time"]
            })
            .then(collected => {
              let foundNo = false;
              collected.map(msg => {
                let msgSplit = msg.toLowerCase().split(" ");
                for (let i = 0; i < msgSplit.length; i++) {
                  if (
                    msgSplit[i].replace(/([^a-z])/g).replace(/([o])/g, "") ===
                      "n" ||
                    msgSplit[i].replace(/([^a-z])/g).replace(/([o])/g, "") ===
                      "npe"
                  ) {
                    foundNo = true;
                  }
                }
              });
              if (foundNo) {
                message.channel.send(
                  `do you want to get banned ${message.author.tag} ??`
                );
              }
            })
            .catch(err => console.error(err));
        });
      } else {
        message.channel.send(
          `How dare you ${message.author.username} !! You don't have the permissions to use this command!`
        );
        message.channel.send("<:natsukiMad:646210751417286656>");
      }
    }
  } else {
    // let server = serverMain.get(message.guild.id);
    if (!args[1]) {
      message.channel.send("there's no user specified !!");
      return message.channel.send("<:natsukiMad:646210751417286656>");
    } else {
      let member = null;

      if (message.mentions.members.first()) {
        if (!message.mentions.members.first().bannable) {
          message.channel.send("I cannot ban this user!");
          message.channel.send("<a:sataniacrying:575078717911597077>");
          return;
        }
        member = message.mentions.members.first().user.id;
      } else {
        member = args[1].replace(/([^0-9])/g, "").trim();
      }

      let reason = args
        .slice(2)
        .join(" ")
        .trim();
      if (!reason) reason = "No reason provided";
      message.guild
        .ban(member, { reason: reason })
        .then(async user => {
          let messageEmbed = new Discord.RichEmbed()
            .setColor("#fe6860")
            .setAuthor("❌ Member banned")
            .setDescription(
              `**${message.author.username}**#${message.author.discriminator} has banned **${user.username}**#${user.discriminator} (ID:${user.id})\n\n**Reason :** ${reason}\n`
            )
            .setFooter(
              `${message.guild.name}`,
              "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
            )
            .setTimestamp();

          // let c = await message.guild.channels.get("664364035386507274");
          // c.send(messageEmbed);

          message.channel.send(messageEmbed);
        })
        .catch(async error => {
          try {
            let res = await message.guild.fetchMember(member);
            if (res) {
              message.channel.send("sorry but i cannot ban this user !");
              return message.channel.send(
                "<:kanna_confused:607077674099277828>"
              );
            } else {
              message.channel.send("please give me an id next time dummy !");
              return message.channel.send("<:monoeil:658912400996827146>");
            }
          } catch {
            if (message.author.id === "157673412561469440") {
              return message.channel.send("yes i will ban them so hard !");
            } else {
              message.channel.send("please give me an id next time dummy !");
              return message.channel.send("<:monoeil:658912400996827146>");
            }
          }
        });
    }
  }
};

//   let id = args[1].replace(/([<>@,#!&])/g, "");
//   try {
//     member = await message.guild.fetchMember(id);
//   } catch {
//     message.channel.send("I don't think this member exists in the guild");
//     message.channel.send("<:kanna_confused:607077674099277828>");
//   }
// } else {
//   member =
//     message.mentions.members.first() ||
//     message.guild.members.get(args[1]);
// }

// if (!member.bannable) {
//   message.channel.send("I cannot ban this user!");
//   message.channel.send("<a:sataniacrying:575078717911597077>");
//   return;
// }
