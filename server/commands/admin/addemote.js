const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("KICK_MEMBERS")) {
    message.channel.send(
      `How dare you ${message.author.username} !! You don't have the permissions to use this command !`
    );
    message.channel.send("<:natsukiMad:646210751417286656>");
  } else {
    if (args[1]) {
      if (args[1].indexOf("<:") >= 0 || args[1].indexOf("<a:") >= 0) {
        let emoteArray = args[1].split(":");
        let emoteId = emoteArray[emoteArray.length - 1].replace(
          /([^0-9])/g,
          ""
        );
        let emoteName = emoteArray[1];
        let url = `https://cdn.discordapp.com/emojis/${emoteId}`;
        if (emoteArray[0] === "<a") {
          url += `.gif`;
        } else {
          url += `.png`;
        }
        if (args[2]) {
          message.guild
            .createEmoji(url, args[2])
            .then(() => message.channel.send("done !"))
            .catch(err => {
              message.channel.send("i was not able to");
              message.channel.send("<:deadinside:665371578359611412>");
              console.error(err);
            });
        } else {
          message.guild
            .createEmoji(url, emoteName)
            .then(() => message.channel.send("done !"))
            .catch(err => {
              message.channel.send("i was not able to");
              message.channel.send("<:deadinside:665371578359611412>");
              console.error(err);
            });
        }
      } else if (args[1].indexOf(".") > -1) {
        if (args[2]) {
          message.guild
            .createEmoji(args[1], args[2])
            .then(() => message.channel.send("done !"))
            .catch(err => {
              message.channel.send("i was not able to");
              message.channel.send("<:deadinside:665371578359611412>");
              console.error(err);
            });
        } else {
          message.channel.send(
            "you need to add the name of the emote after the link !"
          );
        }
      } else if (
        args[1].replace(/([^0-9])/g, "").length === 17 ||
        args[1].replace(/([^0-9])/g, "").length === 18
      ) {
        message.channel
          .fetchMessage(args[1].replace(/([^0-9])/g, ""))
          .then(m => {
            if (m.content.indexOf("<:") >= 0 || m.content.indexOf("<a:") >= 0) {
              let emoteArray = m.content.split(":");
              let emoteId = emoteArray[emoteArray.length - 1].replace(
                /([^0-9])/g,
                ""
              );
              let emoteName = emoteArray[1];
              let url = `https://cdn.discordapp.com/emojis/${emoteId}`;
              if (m.content === "<a") {
                url += `.gif`;
              } else {
                url += `.png`;
              }
              if (args[2]) {
                message.guild
                  .createEmoji(url, args[2])
                  .then(() => message.channel.send("done !"))
                  .catch(err => {
                    message.channel.send("i was not able to");
                    message.channel.send("<:deadinside:665371578359611412>");
                    console.error(err);
                  });
              } else {
                message.guild
                  .createEmoji(url, emoteName)
                  .then(() => message.channel.send("done !"))
                  .catch(err => {
                    message.channel.send("i was not able to");
                    message.channel.send("<:deadinside:665371578359611412>");
                    console.error(err);
                  });
              }
            }
          })
          .catch(err => console.error(err));
      } else {
        return message.channel.send(
          `what emote are you trying to add ?? you have to add that with the command !!\n\nE.g.\n**.addemote :emote: emoteName**\n**.addemote http://image-link.com emoteName**`
        );
      }
    } else {
      return message.channel.send(
        `what emote are you trying to add ?? you have to add that with the command !!\n\nE.g.\n**.addemote :emote: emoteName**\n**.addemote http://image-link.com emoteName**`
      );
    }
  }
};
