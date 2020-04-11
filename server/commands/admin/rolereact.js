const Discord = require("discord.js");
const reactionRoleHelper = require("../../data/reactionRoleHelper");
const { request } = require("graphql-request");

exports.run = async (client, message, args) => {
  let msgArray = [];
  let emoteToUse = null;

  if (!message.member.hasPermission("BAN_MEMBERS")) {
    message.channel.send(
      "You don't have the permissions to use this command !"
    );
    message.channel.send("<:natsukiMad:646210751417286656>");
  } else {
    if (args[1]) {
      reactRoleHelp();
    } else {
      message.channel
        .send(
          `what channel would you like the message to be in ? please mention the channel like ${message.channel} !`
        )
        .then(msg => {
          msgArray.push(msg.id);
          message.channel
            .awaitMessages(res => res.author.id === message.author.id, {
              max: 1,
              time: 60000,
              errors: ["time"]
            })
            .then(async collected => {
              let chan = await message.guild.channels.get(
                collected.first().content.replace(/([^0-9])/g, "")
              );
              if (chan) {
                message.channel
                  .send(
                    `okay i have the channel ${chan} ! what role do you want to use for the reaction role ? please mention the role, send the role id, or the exact name of the role !`
                  )
                  .then(msg => {
                    msgArray.push(msg.id);
                    message.channel
                      .awaitMessages(
                        res => res.author.id === message.author.id,
                        {
                          max: 1,
                          time: 60000,
                          errors: ["time"]
                        }
                      )
                      .then(async collected => {
                        let role = await message.guild.roles.get(
                          collected.first().content.replace(/([^0-9])/g, "")
                        );
                        if (role) {
                          await getEmote(role);
                          getMessage(chan, emoteToUse, role);
                        } else {
                          await Promise.all(
                            message.guild.roles.map(r => {
                              if (
                                r.name.toLowerCase() ===
                                collected.first().content.toLowerCase()
                              ) {
                                role = r;
                              }
                            })
                          );
                          if (role) {
                            await getEmote(role);
                            getMessage(chan, emoteToUse, role);
                          } else {
                            return message.channel.send(
                              `sorry but i cannot find the role **${
                                collected.first().content
                              }**`
                            );
                          }
                        }
                      })
                      .catch(err =>
                        message.channel.send("sorry but i timed out !")
                      );
                  });
              } else {
                return message.channel.send(
                  "sorry but i cannot find this channel or maybe i do not have access to it !!"
                );
              }
            })
            .catch(err => message.channel.send("sorry but i timed out !"));
        });
    }
  }

  function reactRoleHelp() {
    const helpEmbed = new Discord.RichEmbed()
      .setAuthor("Reaction roles")
      .setDescription(
        `use the command **.rolereact** to be walked through creating the custom reaction role message !`
      );
    message.channel.send(helpEmbed);
  }

  async function getEmote(role) {
    await message.channel
      .send(
        `okay i have the role **${role.name}** ! now just tell me the emote you want to use !\nmake sure it is a default emote or an emote from this serveur !!`
      )
      .then(async m => {
        msgArray.push(m.id);
        await message.channel
          .awaitMessages(res => res.author.id === message.author.id, {
            max: 1,
            time: 120000,
            errors: ["time"]
          })
          .then(async collected => {
            await checkEmote(collected.first().content);
            return;
          })
          .catch(err => message.channel.send("sorry but i timed out !"));
      });
  }

  async function getMessage(chan, emote, role) {
    await message.channel
      .send(
        `okay i have the emote ${emote} ! now just tell me the message id or the message itself !`
      )
      .then(m => {
        msgArray.push(m.id);
        message.channel
          .awaitMessages(res => res.author.id === message.author.id, {
            max: 1,
            time: 120000,
            errors: ["time"]
          })
          .then(async collected => {
            let reactionEmote = emote;
            if (emote.indexOf("<") !== -1) {
              reactionEmote = emote
                .replace(/([>])/g, "")
                .split(":")
                .pop();
            }
            let msgIdCheck = collected.first().content.replace(/([^0-9])/g, "");
            if (
              msgIdCheck.length === 16 ||
              msgIdCheck.length === 17 ||
              msgIdCheck.length === 18
            ) {
              try {
                let msg = await chan.fetchMessage(msgIdCheck);
                await msg.react(reactionEmote);
                await message.channel.send("okay done !");
                return addToDatabase(chan.id, role.id, emote, msg.id);
              } catch (err) {
                return message.channel.send(
                  "sorry but i cannot find this message"
                );
              }
            } else {
              chan.send(collected.first().content).then(async msg => {
                await msg.react(reactionEmote);
                await message.channel.send("okay done !");
                return addToDatabase(chan.id, role.id, emote, msg.id);
              });
            }
          })
          .catch(err => message.channel.send("sorry but i timed out !"));
      });
  }

  async function checkEmote(emote) {
    try {
      if (emote.indexOf("<") !== -1) {
        let emoteCheck = emote;
        let emoteId = emoteCheck
          .replace(/([>])/g, "")
          .split(":")
          .pop();
        if (client.emojis.get(emoteId) === undefined) {
          await message.channel
            .send(
              `I cannot use this emote **${emote}**, please type another standard emote or an emote from this serveur !!`
            )
            .then(async msg => {
              msgArray.push(msg.id);
              await message.channel
                .awaitMessages(res => res.author.id === message.author.id, {
                  max: 1,
                  time: 60000,
                  errors: ["time"]
                })
                .then(async collected => {
                  msgArray.push(collected.id);
                  if (collected.first().content.indexOf("<") !== -1) {
                    let emoteCheck = collected.first().content;
                    let emoteId = emoteCheck
                      .replace(/([>])/g, "")
                      .split(":")
                      .pop();
                    if (client.emojis.get(emoteId) === undefined) {
                      return await checkEmoteSingle(collected.first().content);
                    } else {
                      emoteToUse = collected.first().content;
                      return;
                    }
                  } else {
                    emoteToUse = collected.first().content;
                    return;
                  }
                })
                .catch(() => message.channel.send("sorry i timed out !"));
            })
            .catch(err => console.error(err));
        } else {
          emoteToUse = emote;
          return;
        }
      } else {
        if (emote === "⭐") {
          await message.channel
            .send(
              `I cannot use this emote **${emote}**, please type another standard emote or an emote from this serveur !!`
            )
            .then(async msg => {
              msgArray.push(msg.id);
              await message.channel
                .awaitMessages(res => res.author.id === message.author.id, {
                  max: 1,
                  time: 60000,
                  errors: ["time"]
                })
                .then(async collected => {
                  msgArray.push(collected.id);
                  if (collected.first().content.indexOf("<") !== -1) {
                    let emoteCheck = collected.first().content;
                    let emoteId = emoteCheck
                      .replace(/([>])/g, "")
                      .split(":")
                      .pop();
                    if (client.emojis.get(emoteId) === undefined) {
                      return await checkEmoteSingle(collected.first().content);
                    } else {
                      emoteToUse = collected.first().content;
                      return;
                    }
                  } else {
                    emoteToUse = collected.first().content;
                    return;
                  }
                })
                .catch(() => message.channel.send("sorry i timed out !"));
            })
            .catch(err => console.error(err));
        } else {
          emoteToUse = emote;
          return;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function addToDatabase(chanId, roleId, emote, msgId) {
    reactionRoleHelper.addReactionRole(
      message.guild.id,
      chanId,
      roleId,
      emote,
      msgId
    );

    let url = "";

    let query = `mutation {
            addReactionRoles(guild_id: "${message.guild.id}", channel_id: "${chanId}", role_id: "${roleId}", emote: "${emote}", message_id: "${msgId}") {
              guild_id 
            }
          }`;

    try {
      await request(url, query);
    } catch (err) {
      console.error(err);
    }
  }
};
