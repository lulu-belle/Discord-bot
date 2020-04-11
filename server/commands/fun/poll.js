const Discord = require("discord.js");
const _ = require("lodash");
const randomColor = require("../../data/randomColor");

exports.run = async (client, message, args) => {
  //   if (!args[1]) {
  //     message.channel.send("there's no user specified!!!");
  //     message.channel.send("<a:02upset:538273249306345476>");
  //   } else {

  let name,
    pollData = [],
    messageEmbed,
    msgIDsToDeleteBot = [],
    msgIDsToDeleteUser = [],
    msgPollID,
    checkMsgSent = false;

  const checkEmoteSingle = async (emote, position) => {
    try {
      if (emote.indexOf("<") !== -1) {
        if (
          client.emojis.get(
            emote
            .replace(/([>])/g, "")
            .split(":")
            .pop()
          ) === undefined
        ) {
          await message.channel
            .send(
              `I cannot use this emote « ${emote} » for option « ${
                pollData[position].option.length <= 15
                  ? pollData[position].option
                  : pollData[position].option.substring(0, 14)
              } », please type another standard emote or an emote from this serveur`
            )
            .then(async (msg) => {
              msgIDsToDeleteBot.push(msg.id);
              await message.channel
                .awaitMessages(res => res.author.id === message.author.id, {
                  max: 1,
                  time: 60000,
                  errors: ["time"]
                })
                .then(async collected => {
                  msgIDsToDeleteUser.push(collected.id);
                  if (emote.indexOf("<") !== -1) {
                    if (
                      client.emojis.get(
                        collected
                        .first()
                        .content.replace(/([>])/g, "")
                        .split(":")
                        .pop()
                      ) === undefined
                    ) {
                      await checkEmoteSingle(
                        collected.first().content,
                        position
                      );
                    } else {
                      pollData[position].emote = collected.first().content;
                      return;
                    }
                  } else {
                    pollData[position].emote = collected.first().content;
                    return;
                  }
                });
            })
            .catch(err => console.error(err));
        } else {
          pollData[position].emote = emote;
          return;
        }
      } else {
        pollData[position].emote = emote;
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };
  msgIDsToDeleteUser.push(message.id);
  message.channel.send("What are you asking in the poll or what is the name of it ?").then(msg => {
    msgIDsToDeleteBot.push(msg.id);
    message.channel
      .awaitMessages(res => res.author.id === message.author.id, {
        max: 1,
        time: 60000,
        errors: ["time"]
      })
      .then(collected => {
        msgIDsToDeleteUser.push(collected.first().id);
        name =
          collected.first().content.length < 150 ?
          collected.first().content :
          collected.first().content.substring(0, 150);
        message.channel.send("How many options ? (1-10)").then(msg => {
          msgIDsToDeleteBot.push(msg.id);
          message.channel
            .awaitMessages(res => res.author.id === message.author.id, {
              max: 1,
              time: 30000,
              errors: ["time"]
            })
            .then(async collected => {
              msgIDsToDeleteUser.push(collected.first().id);
              let numberOfOptions = collected.first().content.toLowerCase();
              if (isNaN(parseInt(numberOfOptions))) {
                switch (numberOfOptions) {
                  case "one":
                    numberOfOptions = 1;
                    break;
                  case "two":
                    numberOfOptions = 2;
                    break;
                  case "three":
                    numberOfOptions = 3;
                    break;
                  case "four":
                    numberOfOptions = 4;
                    break;
                  case "five":
                    numberOfOptions = 5;
                    break;
                  case "six":
                    numberOfOptions = 6;
                    break;
                  case "seven":
                    numberOfOptions = 7;
                    break;
                  case "eight":
                    numberOfOptions = 8;
                    break;
                  case "nine":
                    numberOfOptions = 9;
                    break;
                  case "ten":
                    numberOfOptions = 10;
                    break;
                  default:
                    message.channel.send(
                      "Please use a number 1-10 ! now you have to start over !"
                    );
                    message.channel.send("<:natsukiMad:646210751417286656>");
                    return;
                }
              } else {
                numberOfOptions = parseInt(numberOfOptions);
              }
              if (numberOfOptions) {
                if (numberOfOptions > 10) {
                  message.channel.send("I cannot do that many ! you have to start over and only do a number between 2-10, i'm so sorry !");
                  message.channel.send("<a:sataniacrying:575078717911597077>");
                  message.channel.bulkDelete(msgIDsToDeleteBot)
                    .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                    .catch(console.error);
                  return;
                } else if (numberOfOptions <= 1) {
                  message.channel.send("why do you need a poll ??");
                  message.channel.send("<:natsukiMad:646210751417286656>");
                  message.channel.bulkDelete(msgIDsToDeleteBot)
                    .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                    .catch(console.error);
                  message.channel.bulkDelete(msgIDsToDeleteUser)
                    .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                    .catch(console.error);
                  return;
                } else {
                  message.channel
                    .send(
                      "Please start listing the options one at a time such as"
                    )
                    .then(msg => msgIDsToDeleteBot.push(msg.id));
                  message.channel
                    .send("option 1 / :emote:")
                    .then(msg => {
                      msgIDsToDeleteBot.push(msg.id);
                      message.channel
                        .awaitMessages(
                          res => res.author.id === message.author.id, {
                            maxMatches: numberOfOptions,
                            time: 300000,
                            errors: ["time"]
                          }
                        )
                        .then(collected => {
                          collected.map(async msg => {
                            msgIDsToDeleteUser.push(msg.id);
                            let optionSplit;
                            if (msg.content.indexOf("/") !== -1) {
                              optionSplit = msg.content.split("/");
                              if (optionSplit[0] && optionSplit[1]) {
                                pollData.push({
                                  option: optionSplit[0],
                                  emote: optionSplit[1].replace(/\s/g, "")
                                });
                              } else {
                                if(checkMsgSent === false){
                                message.channel.send("You didnt follow the format !");
                                message.channel.send("<:deadinside:606350795881054216>");
                                  message.channel.bulkDelete(msgIDsToDeleteBot)
                                    .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                                    .catch(console.error);
                                  checkMsgSent = true;
                                return;
                              }
                              }
                            } else {
                              optionSplit = msg.content.split(" ");
                              let emoteMsg = optionSplit.pop().replace(/\s/g, "");
                              let optionMsg = "";
                              optionSplit.map(str => {
                                optionMsg += `${str} `
                              })
                              if (optionMsg && emoteMsg) {
                                pollData.push({
                                  option: optionMsg,
                                  emote: emoteMsg
                                });
                              } else {
                                if (checkMsgSent === false) { 
                                message.channel.send("You didnt follow the format !");
                                message.channel.send("<:deadinside:606350795881054216>");
                                  message.channel.bulkDelete(msgIDsToDeleteBot)
                                    .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                                    .catch(console.error);
                                checkMsgSent = true;
                                return;
                              }
                              }
                            }
                          });
                        })
                        .then(async () => {
                          messageEmbed = new Discord.RichEmbed()
                            .setColor(randomColor())
                            .setTitle(`\n${name}\n`)
                            // .attachFiles(["../server/images/poll.png"])
                            // .setThumbnail("attachment://poll.png")
                            .setAuthor(
                              message.author.username,
                              message.author.displayAvatarURL
                            )
                            .setFooter(
                              `${message.guild.name}`,
                              "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
                            )
                            .setTimestamp();
                            
                          const checkEmotes = async () => {
                            for (let i = 0; i < numberOfOptions; i++) {
                              await checkEmoteSingle(pollData[i].emote, i);
                            }
                          };
                          await checkEmotes();

                          let descriptionStr = "";
                          _.forEach(pollData, option => {
                            let newOption =
                              option.option.length < 150 ?
                              option.option :
                              option.option.substring(0, 150);
                            descriptionStr += `${option.emote} ${newOption}\n`;
                          });
                          messageEmbed.setDescription(descriptionStr);
                          message.channel.send(messageEmbed).then(msg => {
                            msgIDsToDeleteBot.push(msg.id);
                            msgPollID = msg.id;
                            _.forEach(pollData, option => {
                              let emote =
                                option.emote.indexOf("<") === -1 ?
                                option.emote :
                                option.emote
                                .replace(/([>])/g, "")
                                .split(":")
                                .pop();
                              msg.react(emote);
                            });
                          }).then(() => {
                            message.channel
                              .send("Does this look right ??")
                              .then(msg => {
                                msgIDsToDeleteBot.push(msg.id);
                                message.channel
                                  .awaitMessages(
                                    res => res.author.id === message.author.id, {
                                      maxMatches: 1,
                                      time: 60000,
                                      errors: ["time"]
                                    }
                                  )
                                  .then(collected => {
                                    msgIDsToDeleteUser.push(collected.first().id);
                                    if (
                                      collected
                                      .first()
                                      .content.toLowerCase()
                                      .replace(/\s/g, "") === "y" ||
                                      collected
                                      .first()
                                      .content.toLowerCase()
                                      .replace(/\s/g, "") === "yes"
                                    ) {
                                      //delete all messages
                                      if (msgIDsToDeleteBot.indexOf(msgPollID) > -1){
                                        msgIDsToDeleteBot.splice(msgIDsToDeleteBot.indexOf(msgPollID), 1);
                                      }
                                      message.channel.bulkDelete(msgIDsToDeleteBot)
                                        .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                                        .catch(console.error);
                                      message.channel.bulkDelete(msgIDsToDeleteUser)
                                        .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                                        .catch(console.error);
                                    } else if (
                                      collected
                                      .first()
                                      .content.toLowerCase()
                                      .replace(/\s/g, "") === "n" ||
                                      collected
                                      .first()
                                      .content.toLowerCase()
                                      .replace(/\s/g, "") === "no"
                                    ) {
                                      //delete only bot messages
                                      message.channel.bulkDelete(msgIDsToDeleteBot)
                                        .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                                        .catch(console.error);                                    }
                                  }).catch(error => {
                                    console.error
                                    if (msgIDsToDeleteBot.indexOf(msgPollID) > -1) {
                                      msgIDsToDeleteBot.splice(msgIDsToDeleteBot.indexOf(msgPollID), 1);
                                    }
                                    message.channel.bulkDelete(msgIDsToDeleteBot)
                                      .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                                      .catch(console.error);

                                    // message.channel.send("Time ran out or something went wrong !");
                                    // message.channel.send("<:deadinside:606350795881054216>");
                                  })
                              });
                          })
                        }).catch(error => {
                          if (checkMsgSent === false) { 
                          message.channel.bulkDelete(msgIDsToDeleteBot)
                            .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                            .catch(console.error);
                          message.channel.send("something went wrong with the options you said !");
                          message.channel.send("<:deadinside:606350795881054216>");
                            checkMsgSent = true;
                          console.error(error);
                          return;
                          }
                        })
                    })
                    .catch(error => {
                      message.channel.bulkDelete(msgIDsToDeleteBot)
                        .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                        .catch(console.error);
                      message.channel.send("Time ran out or something went wrong !");
                      message.channel.send("<:deadinside:606350795881054216>");
                      console.error(error);
                      return;
                    });
                  setTimeout(() => {
                    message.channel
                      .send("option 2 / :emote:")
                      .then(msg => msgIDsToDeleteBot.push(msg.id));
                  }, 1000);
                }
              } else {
                console.error(err);
                message.channel.bulkDelete(msgIDsToDeleteBot)
                  .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                  .catch(console.error);
                message.channel.send("Something went wrong !");
                message.channel.send("<:deadinside:606350795881054216>");
                return;
              }
            })
            .catch(() => {
              console.error(err);
              message.channel.bulkDelete(msgIDsToDeleteBot)
                .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                .catch(console.error);
              message.channel.send("Time ran out or something went wrong !");
              message.channel.send("<:deadinside:606350795881054216>");
              return;
            });
        });
      })
      .catch(err => {
        console.error(err);
        message.channel.bulkDelete(msgIDsToDeleteBot)
          .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
          .catch(console.error);
        message.channel.send("Time ran out or something went wrong !");
        message.channel.send("<:deadinside:606350795881054216>");
        return;
      });
  });
};