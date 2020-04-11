exports.run = async (client, message, args) => {
  let nickname = "";
  if (!message.member.hasPermission("KICK_MEMBERS")) {
    if (message.mentions.members.first()) {
      message.channel
        .send("why are you trying to change someones name you weirdo ?!")
        .catch(err => {
          console.error(err);
        });
      message.channel.send("<:sailormoon:663875742299586570>").catch(err => {
        console.error(err);
      });
    } else {
      for (let i = 1; i < args.length; i++) {
        nickname += `${args[i]} `;
      }

      if (nickname === "") {
        nickname = message.member.user.username;
      }
      if (nickname.length > 32) {
        message.channel
          .send(
            `the nickname was too long ! it can only be 32 characters ! not ${nickname.length} !`
          )
          .catch(err => {
            console.error(err);
          });
      } else {
        nickname = nickname.trim();
        message.member
          .setNickname(nickname)
          .then(() =>
            message.channel.send(`hi ${nickname} !`).catch(err => {
              console.error(err);
            })
          )
          .catch(err => {
            console.error(err);
            message.channel
              .send("sorry i was not able to !")
              .then(() =>
                message.channel.send("<:natsukiMad:646210751417286656>")
              );
          });
      }
    }
  } else {
    if (message.mentions.members.first()) {
      for (let i = 1; i < args.length; i++) {
        if (
          args[i].indexOf(`${message.mentions.members.first().user.id}`) === -1
        ) {
          nickname += `${args[i]} `;
        }
      }
      if (nickname === "") {
        nickname = message.mentions.members.first().user.username;
      }
      if (nickname.length > 32) {
        message.channel
          .send(
            `the nickname was too long ! it can only be 32 characters ! not ${nickname.length} !`
          )
          .catch(err => {
            console.error(err);
          });
      } else {
        message.mentions.members
          .first()
          .setNickname(nickname)
          .then(() =>
            message.channel
              .send(
                `${
                  message.mentions.members.first().user.username
                } is now going by **${nickname}**!`
              )
              .catch(err => {
                console.error(err);
              })
          )
          .catch(err => {
            console.error(err);
            message.channel
              .send("sorry i was not able to !")
              .then(() =>
                message.channel.send("<:natsukiMad:646210751417286656>")
              )
              .catch(err => {
                console.error(err);
              });
          });
      }
    } else {
      for (let i = 1; i < args.length; i++) {
        nickname += `${args[i]} `;
      }
      if (nickname === "") {
        nickname = message.author.username;
      }
      if (nickname.length > 32) {
        message.channel
          .send(
            `the nickname was too long ! it can only be 32 characters ! not ${nickname.length} !`
          )
          .catch(err => {
            console.error(err);
          });
      } else {
        message.member
          .setNickname(nickname)
          .then(() =>
            message.channel.send(`hi ${nickname}!`).catch(err => {
              console.error(err);
            })
          )
          .catch(err => {
            console.error(err);
            message.channel
              .send("sorry i was not able to !")
              .then(() =>
                message.channel.send("<:natsukiMad:646210751417286656>")
              )
              .catch(err => {
                console.error(err);
              });
          });
      }
    }
  }
};
