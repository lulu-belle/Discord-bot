const Discord = require("discord.js");
const randomColor = require("../../data/randomColor");
const randomNumber = require("../../data/randomNumber");

exports.run = async (client, message, args) => {
  if (
    message.channel.id === "561453542741901322" &&
    message.author.id !== "157673412561469440" &&
    message.author.id !== "630573404352937996"
  ) {
    message.channel
      .send("sorry but i'm not allowed in here anymore !")
      .catch(err => {
        console.error(err);
      });
    message.channel.send("<a:crying:661358360091688980>").catch(err => {
      console.error(err);
    });
  } else {
    let imageArray = [
      "https://cdn.discordapp.com/attachments/660228695730028594/660228796154380329/testing.gif",
      "https://cdn.discordapp.com/attachments/660228695730028594/660229447261356032/testing.gif",
      "https://cdn.discordapp.com/attachments/660228695730028594/660229987453894666/testing.gif",
      "https://cdn.discordapp.com/attachments/660228695730028594/660230951418331180/testing.gif",
      "https://cdn.discordapp.com/attachments/660228695730028594/660232288436617217/testing.gif",
      "https://cdn.discordapp.com/attachments/660228695730028594/660233584329883648/BowedOrneryGoa-small.gif",
      "https://cdn.discordapp.com/attachments/660228695730028594/660233809471602688/1440624481639.png"
    ];

    if (!args[1]) {
      message.channel.send("Freeze ! ").catch(err => {
        console.error(err);
      });
      message.channel
        .send("<:gunKanna_police:606353675560157194> 🚔")
        .catch(err => {
          console.error(err);
        });
      let messageEmbed = new Discord.RichEmbed()
        .setColor(randomColor())
        .setImage(imageArray[randomNumber(0, 6)])
        .setFooter(
          `${message.guild.name}`,
          "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
        )
        .setTimestamp();

      message.channel.send(messageEmbed).catch(err => {
        console.error(err);
      });
    } else {
      let member = null;
      if (!message.mentions.members.first()) {
        let id = args[1].replace(/([<>@,#!&])/g, "");
        try {
          member = await message.guild.fetchMember(id);
        } catch {
          message.channel.send("I dont know who this is but FBI open up !!");
          message.channel.send("<:gunKanna_police:606353675560157194> 🚔");
          let messageEmbed = new Discord.RichEmbed()
            .setColor(randomColor())
            .setImage(imageArray[randomNumber(0, 6)])
            .setFooter(
              `${message.guild.name}`,
              "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
            )
            .setTimestamp();

          message.channel.send(messageEmbed).catch(err => {
            console.error(err);
          });
          return;
        }
      } else {
        member =
          message.mentions.members.first() ||
          message.guild.members.get(args[1]) ||
          message.member;
      }
      message.channel.send(`${member}\nFBI open up !!`).catch(err => {
        return console.error(err);
      });
      let messageEmbed = new Discord.RichEmbed()
        .setColor(randomColor())
        .setImage(imageArray[randomNumber(0, 6)])
        .setFooter(
          `${message.guild.name}`,
          "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
        )
        .setTimestamp();

      message.channel.send(messageEmbed).catch(err => {
        console.error(err);
      });
    }
  }
};
