const active = new Map();
const talkedRecently = new Set();
const Discord = require("discord.js");
const randomColor = require("../data/randomColor");
const randomNum = require("../data/randomNumber");
const crypto = require("crypto");
const serverMain = require("../data/serverMain");
const userMain = require("../data/userMain");
const { request } = require("graphql-request");
const schedule = require("node-schedule");
const moment = require("moment");

module.exports = async (client, message) => {
  //---------------- automod modules --------------------------------------------------------------------------------------------------------
  if (message.guild && message.channel.type === "text") {
    if (!message.member.hasPermission("BAN_MEMBERS") && !message.author.bot) {
      let server = serverMain.get(message.guild.id);

      let user = userMain
        .get(message.guild.id)
        .users.find(id => id.user_id === message.author.id);

      if (server && user) {
        if ("mention_limit" in server && server.mention_limit) {
          let mentionArray = message.content
            .replace(/([\s])/g, "")
            .split(/(<@.\d{15,20}>)/g);

          for (let i in mentionArray) {
            if (mentionArray[i].indexOf("<") === -1) {
              mentionArray.splice(i, 1);
              i--;
            }
          }

          if (mentionArray.length > server.mention_amount) {
            message
              .delete(225)
              .then(() => {
                warnFunc(`too many mentions in message`);
              })
              .catch(err => console.error(err));
          }
        }
        if ("emote_limit" in server && server.emote_limit) {
          let emoteArray = message.content
            .replace(/([\s])/g, "")
            .split(/(<:.|<a:.)/g);

          for (let i in emoteArray) {
            if (emoteArray[i].indexOf("<") === -1) {
              emoteArray.splice(i, 1);
              i--;
            }
          }

          if (emoteArray.length > server.emote_amount) {
            message
              .delete(225)
              .then(() => {
                // warnFunc(`too many emoted in message`);
              })
              .catch(err => console.error(err));
          }
        }
        if ("everyone_warn" in server && server.everyone_warn) {
          if (
            message.mentions &&
            "everyone" in message.mentions &&
            message.mentions.everyone
          ) {
            message
              .delete(225)
              .then(() => {
                warnFunc(`@everyone\@here ping`);
              })
              .catch(err => console.error(err));
          }
        }
        if ("anti_invite" in server && server.anti_invite) {
          let found = message.content
            .toLowerCase()
            .match(/(https:\/\/discord.gg\/.......)/gi);
          if (found) {
            message
              .delete(225)
              .then(() => {
                warnFunc(`invite link`);
              })
              .catch(err => console.error(err));
          }
        }
        if ("anti_referral" in server && server.anti_referral) {
          let args = message.content.split(/(\s)/g);

          let isLink = false;
          let link = null;

          for (let i in args) {
            if (isValidURL(args[i])) {
              isLink = true;
              link = args[i];
              break;
            }
          }

          if (isLink && link) {
            let foundAffliate = link
              .toLowerCase()
              .match(/(ref=|ref_=|aff=|rid=|refid=)/gi);
            if (foundAffliate) {
              message
                .delete(225)
                .then(() => {
                  warnFunc(`invite link`);
                })
                .catch(err => console.error(err));
            }
          }

          function isValidURL(string) {
            let res = string.match(
              /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
            );
            return res !== null;
          }
        }
        if (
          "dup_watch" in server &&
          server.dup_watch &&
          "dup_limit" in server &&
          server.dup_limit
        ) {
          if (message.embeds.length === 0) {
            if ("last_message" in user && "dup_count" in user) {
              if (
                (message.attachments.size > 0 &&
                  user.last_message ===
                    `${message.attachments.first().filename} | ${
                      message.attachments.first().filesize
                    }`) ||
                user.last_message === message.content.toLowerCase()
              ) {
                user.dup_count++;
                if (user.dup_count > server.dup_limit) {
                  message
                    .delete(225)
                    .then(() => {
                      warnFunc(`duplicate messages`);
                    })
                    .catch(err => console.error(err));
                }
                setTimeout(() => {
                  if (user.dup_count > 1) user.dup_count--;
                }, 300000);
              } else {
                if (message.attachments.size > 0) {
                  user.last_message = `${
                    message.attachments.first().filename
                  } | ${message.attachments.first().filesize}`;
                  user.dup_count = 1;
                } else {
                  user.last_message = message.content.toLowerCase();
                  user.dup_count = 1;
                }
              }
            } else {
              if (message.attachments.size > 0) {
                user.last_message = `${
                  message.attachments.first().filename
                } | ${message.attachments.first().filesize}`;
                user.dup_count = 1;
              } else {
                user.last_message = message.content.toLowerCase();
                user.dup_count = 1;
              }
            }
          }
        }

        function warnMod(reason, oldWarn, newWarn) {
          let warnEmbed = new Discord.RichEmbed()
            .setAuthor("❌ Member warned")
            .setColor("#202225")
            .setDescription(
              `**Lulu Bot !**#5997 has warned **${message.author.username}**#${message.author.discriminator} [${oldWarn} → ${newWarn}]\n(ID:${message.author.id})\n\n**Reason :** ${reason}`
            )
            .setFooter(
              `${message.guild.name}`,
              "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
            )
            .setTimestamp();

          if (message.author.avatarURL)
            warnEmbed.setThumbnail(message.author.avatarURL);

          return warnEmbed;
        }

        function warnUser(reason) {
          let warningMsg = new Discord.RichEmbed()
            .setColor("#202225")
            .setDescription(`**Reason :** ${reason}`)
            .setFooter(
              `${message.guild.name}`,
              "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
            )
            .setTimestamp();

          if (message.author.avatarURL)
            warningMsg.setAuthor(
              `${message.author.username}#${message.author.discriminator} has been warned`,
              message.author.avatarURL
            );
          else
            warningMsg.setAuthor(
              `${message.author.username}#${message.author.discriminator} has been warned`
            );

          return warningMsg;
        }

        function mutedWarning(reason, oldWarn, newWarn) {
          let warningMsg = new Discord.RichEmbed()
            .setAuthor("❌ Member muted for 1 hour")
            .setColor("#202225")
            .setDescription(
              `**Lulu Bot !**#5997 has warned **${message.author.username}**#${message.author.discriminator} [${oldWarn} → ${newWarn}]\n(ID:${message.author.id})\n\n**Reason :** ${reason}`
            )
            .setFooter(
              `${message.guild.name}`,
              "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
            )
            .setTimestamp();

          if (message.author.avatarURL)
            warningMsg.setThumbnail(message.author.avatarURL);

          return warningMsg;
        }

        async function warnFunc(reason) {
          let currentStrikes = user.strikes;

          let strikesAdding = 1;

          currentStrikes += strikesAdding;

          let c = await client.channels.get(server.mod_channel);

          if (currentStrikes === 5) {
            let check = await addToDatabase(currentStrikes);
            if (check) {
              member
                .ban(`5 warnings (${reason})`)
                .catch(err => console.error(err));

              user.strikes = currentStrikes;
            }
          } else if (currentStrikes === 4) {
            let check = await addToDatabase(currentStrikes);
            if (check) {
              member
                .kick(`4 warnings (${reason})`)
                .catch(err => console.error(err));
              user.strikes = currentStrikes;
            }
          } else if (currentStrikes === 3) {
            let check = await addToDatabase(currentStrikes);
            if (check) {
              if (server.muted_role) {
                message.member
                  .addRole(server.muted_role)
                  .then(() => {
                    message.author.send(warnUser(reason));
                    if (c)
                      c.send(
                        mutedWarning(reason, user.strikes, currentStrikes)
                      );
                    user.strikes = currentStrikes;
                    let date = new Date();
                    let newDateObj = moment(date)
                      .add(1, "h")
                      .toDate();
                    schedule.scheduleJob(newDateObj, async () => {
                      let memRoles = message.member._roles;
                      if (memRoles.includes(server.muted_role)) {
                        memRoles.splice(memRoles.indexOf(server.muted_role), 1);
                        message.member
                          .setRoles(memRoles)
                          .then(() => {
                            if (c)
                              c.send(
                                `**${message.author.username}**#${message.author.discriminator} has been unmuted due to the 1 hour being up`
                              );
                          })
                          .catch(err => console.error(err));
                      }
                    });
                  })
                  .catch(err => {
                    console.error(err);
                    user.strikes = currentStrikes;
                  });
              } else {
                if (c)
                  c.send(
                    `**${message.author.username}**#${message.author.discriminator} has 3 warnings but i was unable to mute them because i dont know what your muted role is !\nplease use the command **.setmutedrole** !!`
                  );
                user.strikes = currentStrikes;
              }
            }
          } else {
            let check = await addToDatabase(currentStrikes);
            if (check) {
              message.author.send(warnUser(reason));
              if (c) c.send(warnMod(reason, user.strikes, currentStrikes));
              user.strikes = currentStrikes;
            }
          }
        }

        async function addToDatabase(strikes) {
          let url = "";

          let query = `mutation{
                addStrike(guild_id: "${message.guild.id}", user_id: "${message.author.id}", strikes: ${strikes}) {
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
      }
    }
  }
  //---------------- automod modules --------------------------------------------------------------------------------------------------------
  //---------------- userbot detection --------------------------------------------------------------------------------------------------------
  if (
    message.author.id !== "157673412561469440" &&
    message.author.id !== "630573404352937996" &&
    message.author.id !== "586232973829865495" &&
    message.nonce === null &&
    message.attachments.size <= 0 &&
    !message.author.bot &&
    message.guild && // make sure it's a non-private messages
    message.type === "DEFAULT"
  ) {
    setTimeout(() => {
      message.channel.fetchMessage(message.id).then(async m => {
        if (m.nonce === null) {
          message.channel.send(
            `hey ${message.author} ! stop using a user bot !`
          );
          let messageEmbed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setAuthor("User bot detected")
            .setDescription(
              `Muted **${message.author.username}#${message.author.discriminator}** for using a user bot`
            );

          if (message.guild.id === "664351758344257537") {
            message.delete(200).catch(err => console.error(err));
            let c = await message.guild.channels.get("664364035386507274");
            c.send(messageEmbed);
            message.member.addRole("664383601248305173");
          } else if (message.guild.id === "559560674246787087") {
            message.delete(200).catch(err => console.error(err));
            let c = await message.guild.channels.get("561372938474094603");
            c.send(messageEmbed);
            message.member.addRole("586122632479375370");
          }
        }
      });
    }, 1250);
  }
  //---------------- userbot detection --------------------------------------------------------------------------------------------------------
  //---------------- bad word detection --------------------------------------------------------------------------------------------------------
  if (message.guild) {
    let messageSplit = message.content.toLowerCase().split(" ");
    for (let i = 0; i < messageSplit.length; i++) {
      if (
        messageSplit[i] === "fag" ||
        messageSplit[i] === "faggot" ||
        messageSplit[i] === "nigger"
      ) {
        let messageEmbed = new Discord.RichEmbed()
          .setColor("#ff0000")
          .setAuthor("Bad word")
          .setDescription(
            `Muted **${message.author.username}#${message.author.discriminator}** for saying : ${message.content}`
          );

        if (message.guild.id === "664351758344257537") {
          let c = await message.guild.channels.get("664364035386507274");
          c.send(messageEmbed);
          message.member.addRole("664383601248305173");
          message.delete(250);
        } else if (message.guild.id === "559560674246787087") {
          let c = await message.guild.channels.get("561372938474094603");
          c.send(messageEmbed);
          message.member.addRole("586122632479375370");
          message.delete(250);
        }
      }
      if (messageSplit[i] === "f") {
        if (messageSplit.indexOf("f") < messageSplit.length) {
          if (messageSplit[i + 1].toLowerCase === "a") {
            if (messageSplit.indexOf("a") < messageSplit.length) {
              if (messageSplit[i + 2].toLowerCase === "g") {
                if (message.guild.id === "664351758344257537") {
                  let c = await message.guild.channels.get(
                    "664364035386507274"
                  );
                  c.send(messageEmbed);
                  message.member.addRole("664383601248305173");
                  message.delete(250);
                } else if (message.guild.id === "559560674246787087") {
                  let c = await message.guild.channels.get(
                    "561372938474094603"
                  );
                  c.send(messageEmbed);
                  message.member.addRole("586122632479375370");
                  message.delete(250);
                }
              }
            }
          }
        }
      }
      if (messageSplit[i] === "n") {
        if (messageSplit.indexOf("n") < messageSplit.length) {
          if (messageSplit[i + 1].toLowerCase === "i") {
            if (messageSplit.indexOf("i") < messageSplit.length) {
              if (messageSplit[i + 2].toLowerCase === "g") {
                if (messageSplit.indexOf("g") < messageSplit.length) {
                  if (messageSplit[i + 3].toLowerCase === "g") {
                    if (messageSplit.indexOf("g") < messageSplit.length) {
                      if (messageSplit[i + 4].toLowerCase === "e") {
                        if (messageSplit.indexOf("e") < messageSplit.length) {
                          if (messageSplit[i + 5].toLowerCase === "r") {
                            if (message.guild.id === "664351758344257537") {
                              let c = await message.guild.channels.get(
                                "664364035386507274"
                              );
                              c.send(messageEmbed);
                              message.member.addRole("664383601248305173");
                              message.delete(250);
                            } else if (
                              message.guild.id === "559560674246787087"
                            ) {
                              let c = await message.guild.channels.get(
                                "561372938474094603"
                              );
                              c.send(messageEmbed);
                              message.member.addRole("586122632479375370");
                              message.delete(250);
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    let msgCheckId = message.content.toLowerCase().replace(/([^a-z^0-9])/g, "");
    if (
      msgCheckId.indexOf("157673412561469440") >= 0 &&
      message.author.id !== "326608951107911682"
    ) {
      if (msgCheckId.indexOf("avatar") >= 0) {
        message.channel
          .awaitMessages(res => res.author.bot === true, {
            max: 1,
            time: 7000,
            errors: ["time"]
          })
          .then(collected => {
            setTimeout(() => {
              collected.first().delete();
            }, 225);
          })
          .catch(err => console.error(err));
      }
    }
  }
  //---------------- bad word detection --------------------------------------------------------------------------------------------------------
  //---------------- dm pong + etc --------------------------------------------------------------------------------------------------------
  if (
    message.channel.type === "dm" &&
    message.channel.id !== "644786761511206912" &&
    message.author.id !== "601825955572350976" &&
    message.author.id !== "157673412561469440"
  ) {
    let s = await client.guilds.get("542945080495833119");
    let me = await s.fetchMember("157673412561469440");
    me.send(`${message.author.username} - ${message.content}`);
    if (message.author.id !== "326608951107911682") {
      if (message.content.toLowerCase().replace(/([^a-z])/g, "") === "pong") {
        message.author.send("good bot");
        message.author.send("<a:pat:658917218452635658>");
      } else if (
        message.content
          .toLowerCase()
          .replace(/([^a-z])/g, "")
          .indexOf("iloveyou") >= 0 ||
        message.content.toLowerCase().replace(/([^a-z])/g, "") === "ily"
      ) {
        message.author.send("i love you too !");
        message.author.send("<a:numberHeart:658916574132043776>");
      } else if (
        message.content
          .toLowerCase()
          .replace(/([^a-z])/g, "")
          .indexOf("ihateyou") >= 0
      ) {
        message.author.send("i am telling my owner !!");
      }
    }
  }
  //---------------- dm pong + etc --------------------------------------------------------------------------------------------------------
  //---------------- #exposure yourself --------------------------------------------------------------------------------------------------------
  if (message.channel.id === "666877881451937792") {
    let memberIdArray = [];
    await message.channel
      .fetchMessages({ limit: 100 })
      .then(m => m.map(msg => memberIdArray.push(msg.author.id)));
    if (memberIdArray.length !== new Set(memberIdArray).size) {
      await message.delete();
      let messageEmbed = new Discord.RichEmbed()
        .setColor("#202225")
        .setAuthor("Notice")
        .setDescription(
          `You can only send one message in #${message.channel} !\nYou will have to edit your other message !`
        );

      await message.author.send(messageEmbed);
    }
  }
  //---------------- #exposure yourself --------------------------------------------------------------------------------------------------------
  //---------------- lulu belle --------------------------------------------------------------------------------------------------------
  if (
    (message.content.toLowerCase().indexOf("lulu") > -1 ||
      message.content.toLowerCase().indexOf("belle") > -1) &&
    message.author.id !== "601825955572350976" &&
    message.guild &&
    message.channel.id !== "588599273994584094"
  ) {
    let s = await client.guilds.get("542945080495833119");
    let me = await s.fetchMember("157673412561469440");

    const embed = new Discord.RichEmbed()
      .setColor(randomColor())
      .setDescription(
        `**[► Message Original](https://discordapp.com/channels/${message.channel.guild.id}/${message.channel.id}/${message.id})**\n${message.content}`
      )
      .setAuthor(
        `${message.author.username} (${message.channel.name})`,
        message.author.displayAvatarURL
      )
      .setFooter(
        `${message.guild.name}`,
        "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
      )
      .setTimestamp();

    me.send(embed);
  }
  //---------------- lulu belle --------------------------------------------------------------------------------------------------------
  //---------------- sunlight --------------------------------------------------------------------------------------------------------
  if (
    (message.content
      .toLowerCase()
      .split(" ")
      .indexOf("sun") > -1 ||
      message.content
        .toLowerCase()
        .split(" ")
        .indexOf("sunlight") > -1) &&
    message.author.id !== "601825955572350976" &&
    message.guild &&
    message.channel.id !== "588599273994584094"
  ) {
    let s = await client.guilds.get("559560674246787087");
    let me = await s.fetchMember("575470233935020032");

    const embed = new Discord.RichEmbed()
      .setColor(randomColor())
      .setDescription(
        `**[► Message Original](https://discordapp.com/channels/${message.channel.guild.id}/${message.channel.id}/${message.id})**\n${message.content}`
      )
      .setAuthor(
        `${message.author.username} (${message.channel.name})`,
        message.author.displayAvatarURL
      )
      .setFooter(
        `${message.guild.name}`,
        "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
      )
      .setTimestamp();

    me.send(embed);
  }
  //---------------- sunlight --------------------------------------------------------------------------------------------------------
  //---------------- coryK! --------------------------------------------------------------------------------------------------------
  if (
    (message.content.toLowerCase().indexOf("cory") > -1 ||
      message.content.toLowerCase().indexOf("corey") > -1 ||
      message.content.toLowerCase().indexOf("cori") > -1 ||
      message.content.toLowerCase().indexOf("kory") > -1 ||
      message.content.toLowerCase().indexOf("kori") > -1) &&
    message.author.id !== "601825955572350976" &&
    message.guild &&
    message.channel.id !== "588599273994584094"
  ) {
    let s = await client.guilds.get("559560674246787087");
    let me = await s.fetchMember("326608951107911682");

    const embed = new Discord.RichEmbed()
      .setColor(randomColor())
      .setDescription(
        `**[► Message Original](https://discordapp.com/channels/${message.channel.guild.id}/${message.channel.id}/${message.id})**\n${message.content}`
      )
      .setAuthor(
        `${message.author.username} (${message.channel.name})`,
        message.author.displayAvatarURL
      )
      .setFooter(
        `${message.guild.name}`,
        "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
      )
      .setTimestamp();

    me.send(embed);
  }
  //---------------- coryK! --------------------------------------------------------------------------------------------------------
  //---------------- niiyu --------------------------------------------------------------------------------------------------------
  if (
    (message.content.toLowerCase().indexOf("niiyu") > -1 ||
      message.content.toLowerCase().indexOf("nii") > -1) &&
    message.author.id !== "601825955572350976" &&
    message.guild &&
    message.guild.id === "559560674246787087" &&
    message.channel.id !== "588599273994584094"
  ) {
    let s = await client.guilds.get("559560674246787087");
    let me = await s.fetchMember("274056145856102402");

    const embed = new Discord.RichEmbed()
      .setColor(randomColor())
      .setDescription(
        `**[► Message Original](https://discordapp.com/channels/${message.channel.guild.id}/${message.channel.id}/${message.id})**\n${message.content}`
      )
      .setAuthor(
        `${message.author.username} (${message.channel.name})`,
        message.author.displayAvatarURL
      )
      .setFooter(
        `${message.guild.name}`,
        "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
      )
      .setTimestamp();

    me.send(embed);
  }
  //---------------- niiyu --------------------------------------------------------------------------------------------------------
  //---------------- figure out if message is a command --------------------------------------------------------------------------------------------------------
  let ops = {
    active: active
  };

  if (
    message.content.indexOf(client.config.prefix) !== 0 &&
    message.content.indexOf("Good") !== 0 &&
    message.content.indexOf("hey") !== 0
  )
    return;

  const args = message.content
    .slice(client.config.prefix.length)
    .trim()
    .split(/ +/g);
  let command = args
    .shift()
    .toLowerCase()
    .replace(/([.])/g, "");
  args.unshift(command);

  if (
    message.author.id === "159985870458322944" &&
    message.channel.id === "561401129296986112" &&
    command === "ood"
  ) {
    command = "good";
  } else if (
    message.author.id === "157673412561469440" &&
    message.channel.id === "574945031455244306" &&
    command === "ood"
  ) {
    command = "good";
  }
  if (
    message.author.id === "159985870458322944" &&
    message.channel.id === "664359168140115979" &&
    command === "ey"
  ) {
    command = "hey";
  } else if (
    message.author.id === "157673412561469440" &&
    message.channel.id === "664359168140115979" &&
    command === "ey"
  ) {
    command = "hey";
  }
  if (message.author.id !== "272047159577149441") {
    try {
      // Grab the command data from the client.commands Enmap
      const cmd = await client.commands.get(command);

      // If that command doesn't exist, silently exit and do nothing
      if (!cmd) return;

      if (message.author.id === "601825955572350976") {
        let s = await client.guilds.get("542945080495833119");
        let me = await s.fetchMember("157673412561469440");
        let code = crypto.randomBytes(20).toString("hex");
        me.send(code).then(() => {
          message.channel
            .send("please give me the code so i can use this command !")
            .then(async () => {
              await message.channel
                .awaitMessages(res => res.author.id === "157673412561469440", {
                  max: 1,
                  time: 120000,
                  errors: ["time"]
                })
                .then(async collected => {
                  if (collected.first().content.trim() === code) {
                    try {
                      cmd.run(client, message, args, ops);
                    } catch (err) {
                      console.error(err);
                    }
                  } else {
                    return message.channel.send(
                      "sorry but that is the wrong code !"
                    );
                  }
                })
                .catch(err =>
                  message.channel.send(
                    "sorry but you did not give me the code fast enough !"
                  )
                );
            });
        });
      } else {
        if (talkedRecently.has(message.author.id)) {
          message.channel.send("So fast! Wait a moment please!");
        } else {
          // Run the command
          try {
            cmd.run(client, message, args, ops);
          } catch (err) {
            console.error(err);
          }

          talkedRecently.add(message.author.id);

          setTimeout(() => {
            talkedRecently.delete(message.author.id);
          }, 1500);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  //---------------- figure out if message is a command --------------------------------------------------------------------------------------------------------
};

// let a = new Date();
// timeConverterDMY(a);
// let found = false;

// for (let i = 0; i < messageCounter.counts.length; i++) {
//   if (messageCounter.counts[i].hasOwnProperty(message.guild.id)) {
//     if (
//       messageCounter.counts[i][message.guild.id].hasOwnProperty(
//         message.channel.id
//       )
//     ) {
//       if (
//         messageCounter.counts[i][message.guild.id].day ===
//         timeConverterDMY(a)
//       ) {
//         messageCounter.addCount(
//           message.guild.id,
//           message.channel.id,
//           message.channel.name,
//           timeConverterDMY(a),
//           i
//         );
//       } else {
//         //reset count and new day entry
//         let oldDay = timeConverterDMY(a).split(" ");
//         oldDay[0] = parseInt(oldDay[0]) - 1;
//         oldDay = `${oldDay[0]} ${oldDay[1]} ${oldDay[2]}`;
//         messageCounter.newDay(
//           message.guild.id,
//           message.channel.id,
//           message.channel.name,
//           oldDay,
//           timeConverterDMY(a),
//           i
//         );
//       }
//     } else {
//       messageCounter.addChannel(
//         message.guild.id,
//         message.channel.id,
//         message.channel.name,
//         timeConverterDMY(a),
//         i
//       );
//     }
//     found = true;
//   } else if (!found && i === messageCounter.counts.length - 1) {
//     messageCounter.addGuild(
//       message.guild.id,
//       message.channel.id,
//       message.channel.name,
//       timeConverterDMY(a)
//     );
//   }
// }

// if (messageCounter.counts.length === 0) {
//   messageCounter.addGuild(
//     message.guild.id,
//     message.channel.id,
//     message.channel.name,
//     timeConverterDMY(a)
//   );
// }

//---------------------------------------------------------------
// if (
//   message.content
//     .toLowerCase()
//     .replace(/([^a-z])/g, "")
//     .indexOf("lulu") >= 0 ||
//   message.content
//     .toLowerCase()
//     .replace(/([^a-z])/g, "")
//     .indexOf("lewlew") >= 0 ||
//   message.content
//     .toLowerCase()
//     .replace(/([^a-z])/g, "")
//     .indexOf("lewdlewd") >= 0 ||
//   message.content
//     .toLowerCase()
//     .replace(/([^a-z])/g, "")
//     .indexOf("lewlewd") >= 0 ||
//   message.content
//     .toLowerCase()
//     .replace(/([^a-z])/g, "")
//     .indexOf("luul") >= 0 ||
//   message.content
//     .toLowerCase()
//     .replace(/([^a-z])/g, "")
//     .indexOf("loolo") >= 0 ||
//   message.content
//     .toLowerCase()
//     .replace(/([^a-z])/g, "")
//     .indexOf("lullu") >= 0
// ) {
//   if (message.author.id !== "326608951107911682") {
//     setTimeout(() => {
//       message.delete();
//     }, 225);
//   }
// }
//-------------------------------------------------------------

// if (
//   (message.content.toLowerCase().indexOf("fig") > -1 ||
//     message.content.toLowerCase().indexOf("figgy") > -1 ||
//     message.content.toLowerCase().indexOf("figgie") > -1) &&
//   message.author.id !== "601825955572350976" &&
//   message.guild
// ) {
//   let s = await client.guilds.get("559560674246787087");
//   let me = await s.fetchMember("553266507593809941");

//   const embed = new Discord.RichEmbed()
//     .setColor(randomColor())
//     .setDescription(
//       `**[► Message Original](https://discordapp.com/channels/${message.channel.guild.id}/${message.channel.id}/${message.id})**\n${message.content}`
//     )
//     .setAuthor(
//       `${message.author.username} (${message.channel.name})`,
//       message.author.displayAvatarURL
//     );

//   me.send(embed);
// }
//-----------------------------------------
// if (message.author.id === "272047159577149441") {
//   if (randomNum(1, 10) === 5) {
//     message.delete(230);
//     setTimeout(async () => {
//       if (message.guild.id === "559560674246787087") {
//         let c = await message.guild.channels.get("588599273994584094");
//         c.fetchMessages({ limit: 1 }).then(m => m.first().delete());
//       }
//     }, 1000);
//   }
// }
