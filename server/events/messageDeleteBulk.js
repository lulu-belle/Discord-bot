const Discord = require("discord.js");
const serverMain = require("../data/serverMain");

module.exports = async (client, messages) => {
  let base = messages.first();
  if (base.channel.guild && base.channel.type === "text") {
    let server = serverMain.get(base.channel.guild.id);
    if (server && "message_log" in server && server.message_log) {
      let c = await base.channel.guild.channels.get(server.message_log);

      if (c) {
        let str = `-- Deleted Messages | #${base.channel.name} (${base.channel.id}) | ${base.channel.guild.name} (${base.channel.guild.id}) --\r\n`;

        await Promise.all(
          messages.map(msg => {
            str += `\r\n[${msg.createdAt}] ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}) : ${msg.content}\r\n`;
          })
        );

        let strBuffer = Buffer.from(str);

        let attachment = new Discord.Attachment(
          strBuffer,
          "DeletedMessages.txt"
        );
        let textLogChan = await client.channels.get("681758675588874240");
        textLogChan.send(attachment).then(m => {
          let webURL = `https://txt.discord.website/?txt=681758675588874240/${
            m.attachments.first().id
          }/DeletedMessages`;
          let downloadURL = `${m.attachments.first().url}`;
          let embed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setAuthor("Messages deleted in bulk")
            .setDescription(
              `🚮 **${messages.size}** messages were deleted from ${base.channel}\n\n[📄 View](${webURL}) | [📥 Download](${downloadURL})\n`
            )
            .setFooter(
              `${base.channel.guild.name}`,
              "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
            )
            .setTimestamp();
          c.send(embed);
        });
      }
    }
  }
};

// if (message.guild) {
//     let server = serverMain.get(message.guild.id);

//     if (server.message_log) {
//         let messageEmbed = new Discord.RichEmbed()
//             .setColor("#ff0000")
//             .setAuthor("Message deleted")
//             .setFooter(
//                 `${message.guild.name}`,
//                 "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
//             )
//             .setTimestamp();
//         let c = await message.guild.channels.get("664363921196580874");

//         if (
//             message.content === "" &&
//             message.embeds.length > 0 &&
//             message.embeds[0].url !== undefined
//         ) {
//             let str = "";
//             if (message.embeds[0].author) {
//                 if (
//                     "name" in message.embeds[0].author &&
//                     message.embeds[0].author.name
//                 )
//                     str += `\n**Author :** ${message.embeds[0].author.name}`;
//             }
//             if (message.embeds[0].title)
//                 str += `\n**Title :** ${message.embeds[0].title}`;
//             if (message.embeds[0].description)
//                 str += `\n**Description :** ${message.embeds[0].description}`;
//             if (message.embeds[0].url)
//                 str += `\n**URL :** ${message.embeds[0].url}`;

//             messageEmbed.setDescription(
//                 `❌**${message.author.username}**#${message.author.discriminator} (ID:${message.author.id}) deleted an embed message in ${message.channel}\n${str}`
//             );
//             c.send(messageEmbed);
//         } else if (message.content.length > 0) {
//             messageEmbed.setDescription(
//                 `❌**${message.author.username}**#${message.author.discriminator} (ID:${message.author.id}) deleted a message in ${message.channel}\n\n**Content :** ${message.content}`
//             );
//             c.send(messageEmbed);
//         }
//     }
// }
// };

// else if (message.guild && message.guild.id === "559560674246787087") {
//   let audit = await message.guild.fetchAuditLogs();
//   if (
//     !audit.entries.first().executor.bot &&
//     audit.entries.first().executor.id !== "157673412561469440" &&
//     audit.entries.first().executor.id !== "630573404352937996" &&
//     audit.entries.first().executor.id !== "326608951107911682"
//   ) {
//     if (message.author.id === "601825955572350976") {
//       if (deletedRecently.has("check-5")) {
//         message.channel.send("byee !! guild is being deleted !!");

//         setTimeout(() => {
//           message.channel.send("3");
//         }, 1000);
//         setTimeout(() => {
//           message.channel.send("2");
//         }, 2000);
//         setTimeout(() => {
//           message.channel.send("1");
//         }, 3000);
//         setTimeout(() => {
//           message.guild.delete();
//         }, 4000);
//       } else {
//         if (deletedRecently.has("check-4")) {
//           let { body: buffer } = await snekfetch.get(
//             "https://cdn.discordapp.com/attachments/660228695730028594/675535288365219860/unknown.png"
//           );
//           let attachment = new Discord.Attachment(buffer, "delete.png");

//           message.channel.send(
//             `this is your last chance ! better ask someone who knows how to do simple programming to explain the **message.guild.delete()** in the image to you !!`
//           );

//           setTimeout(() => {
//             message.channel.send(
//               `here are the docs on **guild.delete()** idiot`,
//               attachment
//             );
//           }, 800);

//           deletedRecently.add("check-5");
//           setTimeout(() => {
//             deletedRecently.delete("check-5");
//           }, 60000);
//         } else {
//           if (deletedRecently.has("check-3")) {
//             let { body: buffer } = await snekfetch.get(
//               "https://cdn.discordapp.com/attachments/660228695730028594/675531657368829973/unknown.png"
//             );
//             let attachment = new Discord.Attachment(buffer, "delete.png");

//             message.channel.send("do you really think i am lying ??");
//             setTimeout(() => {
//               message.channel.send(
//                 "look ! this is in my code, each time you delete a message the check goes up",
//                 attachment
//               );
//             }, 800);

//             deletedRecently.add("check-4");
//             setTimeout(() => {
//               deletedRecently.delete("check-4");
//             }, 60000);
//           } else {
//             if (deletedRecently.has("check-2")) {
//               message.channel.send(
//                 "listen, i will literally delete the guild if you do not stop"
//               );

//               deletedRecently.add("check-3");
//               setTimeout(() => {
//                 deletedRecently.delete("check-3");
//               }, 60000);
//             } else {
//               if (deletedRecently.has("check-1")) {
//                 message.channel.send("again !! really ?? please stop it !");

//                 deletedRecently.add("check-2");
//                 setTimeout(() => {
//                   deletedRecently.delete("check-2");
//                 }, 60000);
//               } else {
//                 message.channel.send("pardon ?? where did my message go ??");

//                 deletedRecently.add("check-1");
//                 setTimeout(() => {
//                   deletedRecently.delete("check-1");
//                 }, 60000);
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }
