const Nightmare = require("nightmare");
const Discord = require("discord.js");
const randomColor = require("../../data/randomColor");

exports.run = async (client, message) => {
  message.channel.startTyping();

  const nightmare = Nightmare({
    show: false
  });

  await nightmare
    .goto(`https://mee6.xyz/leaderboard/${message.guild.id}`)
    .wait(".leaderboardPlayerStatValue")
    .wait(1000)
    .evaluate(async () => {
      return await Array.from(
        document.querySelectorAll(".leaderboardPlayer"),
        element =>
          (element = {
            username: element.children[0].children[2].innerText,
            messages: element.children[1].children[0].children[1].innerText,
            experience: element.children[1].children[1].children[1].innerText,
            level:
              element.children[1].children[2].children[0].children[1].innerText
          })
      );
    })
    .end()
    .then(users => {
      let username = message.author.username;
      let member = message.author;
      if (message.mentions.members.first()) {
        username = message.mentions.members.first().user.username;
        member = message.mentions.members.first().user;
      }
      for (let user in users) {
        if (users[user].username === username) {
          let embed = new Discord.RichEmbed()
            .setAuthor(member.username, member.displayAvatarURL)
            .setColor(randomColor())
            .setDescription(
              `**Messages :** ${users[user].messages}\n**Experience :** ${users[user].experience}\n**Level :** ${users[user].level}`
            )
            .setFooter(
              `${message.guild.name}`,
              "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
            )
            .setTimestamp();
          return message.channel
            .send(embed)
            .then(() => message.channel.stopTyping(true));
        }
      }
      return message.channel.send(
        `sorry but **${username}** is not in the top 100 and i do not feel like going and finding them !`
      );
    })
    .catch(function(err) {
      console.error(err);
      message.channel.send("i broke something");
      message.channel
        .send("<:deadinside:606350795881054216>")
        .then(() => message.channel.stopTyping(true));
    });
};

// const puppeteer = require("puppeteer");
// const Discord = require("discord.js");
// const randomColor = require("../../data/randomColor");

// exports.run = async (client, message) => {
//   function delay(timeout) {
//     return new Promise(resolve => {
//       setTimeout(resolve, timeout);
//     });
//   }

//   const browser = await puppeteer.launch({
//     headless: true,
//     args: ["--no-sandbox"]
//   });
//   const page = await browser.newPage();
//   await page.goto(`https://mee6.xyz/leaderboard/559560674246787087`);
//   await page.waitForSelector(".leaderboardPlayerStatValue");
//   await delay(1000);

//   const users = await page.evaluate(() =>
//     Array.from(
//       document.querySelectorAll(".leaderboardPlayer"),
//       element =>
//       (element = {
//         username: element.children[0].children[2].innerText,
//         messages: element.children[1].children[0].children[1].innerText,
//         experience: element.children[1].children[1].children[1].innerText,
//         level: element.children[1].children[2].children[0].children[1].innerText
//       })
//     )
//   );
//   await browser.close();

//   let username = message.author.username;
//   let member = message.author;
//   if (message.mentions.members.first()) {
//     username = message.mentions.members.first().user.username;
//     member = message.mentions.members.first().user;
//   }
//   console.log(username, member);

//   for (let user in users) {
//     if (users[user].username === username) {
//       let embed = new Discord.RichEmbed()
//         .setAuthor(member.username, member.displayAvatarURL)
//         .setColor(randomColor())
//         .setDescription(
//           `**Messages :** ${users[user].messages}\n**Experience :** ${users[user].experience}\n**Level :** ${users[user].level}`
//         );
//       return message.channel.send(embed);
//       // return message.channel.send(
//       //   `**${username}** has sent a total of **${users[user].messages} messages** for a total of **${users[user].experience} experience** ! They are **level ${users[user].level}** !!`
//       // );
//     }
//   }
//   return message.channel.send(
//     `sorry but **${username}** is not in the top 100 and i do not feel like going and finding them !`
//   );
// };
