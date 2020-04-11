const Discord = require("discord.js");
const randomColor = require("../data/randomColor");
const randomNum = require("../data/randomNumber");
const _ = require("lodash");
const Canvas = require("canvas");
const path = require("path");
const snekfetch = require("snekfetch");
const GIFEncoder = require("gif-encoder-2");
const { writeFile } = require("fs");
let messageShipId = require("../data/messageShipId");
const { request } = require("graphql-request");
const memberListHelper = require("../data/memberListHelper");
const welcomePointListHelper = require("../data/welcomePointListHelper");
const moment = require("moment");
const reactionRoleHelper = require("../data/reactionRoleHelper");

module.exports = async (client, messageReaction, user) => {
  //---------------- database react roles ---------------------------------------------------------------------------------------------------
  for (let i in reactionRoleHelper.reactionRoleList) {
    let emoteName = reactionRoleHelper.reactionRoleList[i].emote;
    if (emoteName.indexOf("<") > -1) {
      emoteName = emoteName.split(":")[1];
    }
    if (
      messageReaction._emoji.name === emoteName &&
      messageReaction.message.id ===
        reactionRoleHelper.reactionRoleList[i].message_id
    ) {
      await addRole(reactionRoleHelper.reactionRoleList[i].role_id);
    }
  }
  //---------------- database react roles ---------------------------------------------------------------------------------------------------
  //---------------- star board -------------------------------------------------------------------------------------------------------------
  if (messageReaction._emoji.name === "⭐") {
    if (messageReaction.message.author.id === user.id) {
      let oriMsg = await messageReaction.message.channel.fetchMessage(
        messageReaction.message.id
      );
      oriMsg.reactions.map(r => {
        r.message.reactions.forEach(reaction => reaction.remove(user.id));
      });
      return;
    }
    messageReaction.message.reactions.map(async r => {
      if (r._emoji.name === "⭐") {
        if (r.count >= 3) {
          let starChannel = messageReaction.message.channel.guild.channels.find(
            channel => channel.name === "⭐memories"
          );
          if (!starChannel) {
            starChannel = messageReaction.message.channel.guild.channels.find(
              channel => channel.name === "memories"
            );
            if (!starChannel) {
              return messageReaction.message.channel.send(
                `you do not have a starboard channel ! please make a channel and name it exactly « ⭐memories » ou « memories »`
              );
            }
          }
          const fetch = await starChannel.fetchMessages({
            limit: 100
          });

          const stars = fetch.find(
            m =>
              m.embeds.length !== 0 &&
              "footer" in m.embeds[0] &&
              "text" in m.embeds[0].footer &&
              m.embeds[0].footer.text.startsWith("⭐") &&
              m.embeds[0].footer.text.endsWith(messageReaction.message.id)
          );
          if (stars) {
            const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(
              stars.embeds[0].footer.text
            );
            const foundStar = stars.embeds[0];
            const image =
              messageReaction.message.attachments.array().length > 0 &&
              messageReaction.message.attachments.array()[0].filesize > 0
                ? await extension(
                    messageReaction,
                    messageReaction.message.attachments.array()[0].url
                  )
                : "";

            const embed = new Discord.RichEmbed()
              .setColor(foundStar.color)
              .setDescription(foundStar.description)
              .setAuthor(
                `${messageReaction.message.author.username} (${messageReaction.message.channel.name})`,
                messageReaction.message.author.displayAvatarURL
              )
              .setTimestamp()
              .setFooter(
                `⭐ ${parseInt(star[1]) + 1} | ${messageReaction.message.id}`
              )
              .setImage(image);
            const starMsg = await starChannel.fetchMessage(stars.id);
            await starMsg.edit({
              embed
            });
          } else {
            const image =
              messageReaction.message.attachments.array().length > 0 &&
              messageReaction.message.attachments.array()[0].filesize > 0
                ? await extension(
                    messageReaction,
                    messageReaction.message.attachments.array()[0].url
                  )
                : "";
            if (image === "" && messageReaction.message.content.length < 1)
              return messageReaction.message.channel.send(
                `${user}, you cannot star an empty message.`
              );

            const embed = new Discord.RichEmbed()
              .setColor(randomColor())
              .setDescription(
                `**[► Original Message](https://discordapp.com/channels/${messageReaction.message.channel.guild.id}/${messageReaction.message.channel.id}/${messageReaction.message.id})**\n${messageReaction.message.content}`
              )
              .setAuthor(
                `${messageReaction.message.author.username} (${messageReaction.message.channel.name})`,
                messageReaction.message.author.displayAvatarURL
              )
              .setTimestamp(new Date())
              .setFooter(`⭐ 3 | ${messageReaction.message.id}`)
              .setImage(image);
            await starChannel.send({
              embed
            });
          }
        }
      }
    });
  }
  //---------------- star board -------------------------------------------------------------------------------------------------------------
  //---------------- rules react ------------------------------------------------------------------------------------------------------------
  else if (messageReaction._emoji.name === "check") {
    //---------------- rules react (our home) -----------------------------------------------------------------------------------------------
    if (messageReaction.message.id === "662982653074472960") {
      if (user.id !== "272047159577149441") {
        let memberRolesIdArray = [];
        let mem = await messageReaction.message.guild.fetchMember(user.id);
        if (mem) {
          mem.roles.map(r => {
            memberRolesIdArray.push(r.id);
          });

          for (let i = 0; i < memberRolesIdArray.length; i++) {
            if (memberRolesIdArray[i] === "596016686331723785") {
              memberRolesIdArray.splice(i, 1);
              memberRolesIdArray.push("561302712470208513");
              mem.setRoles(memberRolesIdArray).then(async () => {
                let c = await client.guilds
                  .get("559560674246787087")
                  .channels.get("561453542741901322");

                const encoder = new GIFEncoder(600, 335, "octree", false);
                // encoder
                //   .createReadStream()
                //   .pipe(fs.createWriteStream("myanimated.gif"));

                encoder.start();
                encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
                encoder.setDelay(600); // frame delay in ms
                encoder.setQuality(1); // image quality. 10 is default.

                const { body: bufferAvatar } = await snekfetch.get(
                  mem.user.displayAvatarURL
                );

                // async function addFrame(path) {
                //   let canvasFrame = Canvas.createCanvas(600, 335);
                //   let ctxFrame = canvasFrame.getContext("2d");

                //   let reqPathFrame = path.join(__dirname, path);
                //   let backgroundFrame = await Canvas.loadImage(reqPathFrame);
                //   ctxFrame.drawImage(
                //     backgroundFrame,
                //     0,
                //     0,
                //     canvasFrame.width,
                //     canvasFrame.height
                //   );

                //   // Pick up the pen
                //   ctxFrame.beginPath();
                //   // Start the arc to form a circle
                //   ctxFrame.arc(300, 85, 65, 0, Math.PI * 2, true);
                //   // Put the pen down
                //   ctxFrame.closePath();
                //   // Clip off the region you drew on
                //   ctxFrame.clip();

                //   await ctxFrame.drawImage(avatarWelcome, 235, 20, 130, 130); //115

                //   encoder.addFrame(ctxFrame);
                // }

                // await addFrame("../images/our_home_testing_frame1.png");
                // await addFrame("../images/our_home_testing_frame2.png");
                // await addFrame("../images/our_home_testing_frame3.png");
                // await addFrame("../images/our_home_testing_frame4.png");

                //--------------------------------------------------------- frame 1
                const canvasFrame1 = Canvas.createCanvas(600, 335);

                const ctxFrame1 = canvasFrame1.getContext("2d");

                let reqPathFrame1 = path.join(
                  __dirname,
                  "../images/our_home_testing_frame1.png"
                );
                const backgroundFrame1 = await Canvas.loadImage(reqPathFrame1);
                ctxFrame1.drawImage(
                  backgroundFrame1,
                  0,
                  0,
                  canvasFrame1.width,
                  canvasFrame1.height
                );

                // Pick up the pen
                ctxFrame1.beginPath();
                // Start the arc to form a circle
                ctxFrame1.arc(300, 85, 65, 0, Math.PI * 2, true);
                // Put the pen down
                ctxFrame1.closePath();
                // Clip off the region you drew on
                ctxFrame1.clip();

                const avatarWelcome1 = await Canvas.loadImage(bufferAvatar);
                await ctxFrame1.drawImage(avatarWelcome1, 235, 20, 130, 130); //115

                encoder.addFrame(ctxFrame1);
                //--------------------------------------------------------- frame 1
                //--------------------------------------------------------- frame 2
                const canvasFrame2 = Canvas.createCanvas(600, 335);

                const ctxFrame2 = canvasFrame2.getContext("2d");

                let reqPathFrame2 = path.join(
                  __dirname,
                  "../images/our_home_testing_frame2.png"
                );
                const backgroundFrame2 = await Canvas.loadImage(reqPathFrame2);
                ctxFrame2.drawImage(
                  backgroundFrame2,
                  0,
                  0,
                  canvasFrame2.width,
                  canvasFrame2.height
                );

                // Pick up the pen
                ctxFrame2.beginPath();
                // Start the arc to form a circle
                ctxFrame2.arc(300, 85, 65, 0, Math.PI * 2, true);
                // Put the pen down
                ctxFrame2.closePath();
                // Clip off the region you drew on
                ctxFrame2.clip();

                const avatarWelcome2 = await Canvas.loadImage(bufferAvatar);
                await ctxFrame2.drawImage(avatarWelcome2, 235, 20, 130, 130); //115

                encoder.addFrame(ctxFrame2);
                //--------------------------------------------------------- frame 2
                //--------------------------------------------------------- frame 3
                const canvasFrame3 = Canvas.createCanvas(600, 335);

                const ctxFrame3 = canvasFrame3.getContext("2d");

                let reqPathFrame3 = path.join(
                  __dirname,
                  "../images/our_home_testing_frame3.png"
                );
                const backgroundFrame3 = await Canvas.loadImage(reqPathFrame3);
                ctxFrame3.drawImage(
                  backgroundFrame3,
                  0,
                  0,
                  canvasFrame3.width,
                  canvasFrame3.height
                );

                // Pick up the pen
                ctxFrame3.beginPath();
                // Start the arc to form a circle
                ctxFrame3.arc(300, 85, 65, 0, Math.PI * 2, true);
                // Put the pen down
                ctxFrame3.closePath();
                // Clip off the region you drew on
                ctxFrame3.clip();

                const avatarWelcome3 = await Canvas.loadImage(bufferAvatar);
                await ctxFrame3.drawImage(avatarWelcome3, 235, 20, 130, 130); //115

                encoder.addFrame(ctxFrame3);
                //--------------------------------------------------------- frame 3
                //--------------------------------------------------------- frame 4
                const canvasFrame4 = Canvas.createCanvas(600, 335);

                const ctxFrame4 = canvasFrame4.getContext("2d");

                let reqPathFrame4 = path.join(
                  __dirname,
                  "../images/our_home_testing_frame4.png"
                );
                const backgroundFrame4 = await Canvas.loadImage(reqPathFrame4);
                ctxFrame4.drawImage(
                  backgroundFrame4,
                  0,
                  0,
                  canvasFrame4.width,
                  canvasFrame4.height
                );

                // Pick up the pen
                ctxFrame4.beginPath();
                // Start the arc to form a circle
                ctxFrame4.arc(300, 85, 65, 0, Math.PI * 2, true);
                // Put the pen down
                ctxFrame4.closePath();
                // Clip off the region you drew on
                ctxFrame4.clip();

                const avatarWelcome4 = await Canvas.loadImage(bufferAvatar);
                await ctxFrame4.drawImage(avatarWelcome4, 235, 20, 130, 130); //115

                encoder.addFrame(ctxFrame4);
                //--------------------------------------------------------- frame 4

                encoder.finish();
                const buffer = encoder.out.getData();
                let rolesC = await client.guilds
                  .get("559560674246787087")
                  .channels.get("561423217709940770");
                let introC = await client.guilds
                  .get("559560674246787087")
                  .channels.get("559576694235725825");
                writeFile(
                  path.join(__dirname, "output", "welcome.gif"),
                  buffer,
                  error => {
                    const attachment = new Discord.Attachment(
                      buffer,
                      "welcome-image.gif"
                    );

                    c.send(attachment).then(() => {
                      c.send(
                        `<a:star:662882173145055242> ${mem} <a:star:662882173145055242>\nWelcome to the **Our Home** !\nMake sure you to get some roles in ${rolesC} and tell us a little about yourself in ${introC} ! If you have any questions feel free to ask any of the <@&559562042907033651> ! <:softheart:575053165804912652>\n<@&672789435875590144>`
                      )
                        .then(msg => {
                          const filter = m =>
                            m.content
                              .toLowerCase()
                              .replace(/([^a-z])/g, "")
                              .indexOf("hi") >= 0 ||
                            m.content
                              .toLowerCase()
                              .replace(/([^a-z])/g, "")
                              .indexOf("hello") >= 0 ||
                            m.content
                              .toLowerCase()
                              .replace(/([^a-z])/g, "")
                              .indexOf("howareyou") >= 0 ||
                            m.content
                              .toLowerCase()
                              .replace(/([^a-z])/g, "")
                              .indexOf("howareu") >= 0 ||
                            m.content
                              .toLowerCase()
                              .replace(/([^a-z])/g, "")
                              .indexOf("welcome") >= 0 ||
                            m.content
                              .toLowerCase()
                              .replace(/([^a-z])/g, "")
                              .indexOf("bienvenue") >= 0 ||
                            m.content
                              .toLowerCase()
                              .replace(/([^a-z])/g, "")
                              .indexOf("yo") >= 0 ||
                            m.content
                              .toLowerCase()
                              .replace(/([^a-z])/g, "")
                              .indexOf("hey") >= 0 ||
                            m.content
                              .toLowerCase()
                              .replace(/([^a-z])/g, "")
                              .indexOf("hai") >= 0 ||
                            m.content
                              .toLowerCase()
                              .replace(/([^a-z])/g, "")
                              .indexOf("hail") >= 0 ||
                            m.content
                              .toLowerCase()
                              .replace(/([^a-z])/g, "")
                              .indexOf("nicetomeetyou") >= 0;
                          const collector = msg.channel.createMessageCollector(
                            filter,
                            { time: 120000 }
                          );
                          let userArray = [];
                          collector.on("collect", m => {
                            if (!userArray.includes(m.author.id))
                              userArray.push(m.author.id);
                          });
                          collector.on("end", async collected => {
                            let url =
                              "";

                            for (let user in userArray) {
                              let query = `query {
                              getUser(guild_id: "${msg.guild.id}", user_id: "${userArray[user]}") {
                                guild_id user_id welcome_points
                              }
                            }`;
                              try {
                                let res = await request(url, query);
                                let points = res.getUser.welcome_points;
                                if (randomNum(1, 200) === 1) {
                                  points += 10000;
                                } else {
                                  points += randomNum(200, 300);
                                }
                                query = `mutation {
                              addWelcomePoints(guild_id: "${msg.guild.id}", user_id: "${userArray[user]}", welcome_points: ${points}) {
                                guild_id user_id welcome_points
                              }
                            }`;
                                try {
                                  await request(url, query);
                                } catch (err) {
                                  console.error(err);
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }
                          });
                        })
                        .catch(err => console.error(err));
                    });
                    // gif drawn or error
                  }
                );
              });
            }
          }
        } else {
          let s = await client.guilds.get("559560674246787087");
          s.fetchMember("157673412561469440")
            .then(m =>
              m.send(
                `${user.username} reacted but i failed to give them the new role`
              )
            )
            .catch(err => console.error(err));
        }
      }
    }
    //---------------- rules react (our home) -----------------------------------------------------------------------------------------------
    //---------------- rules react (losers club) --------------------------------------------------------------------------------------------
    else if (messageReaction.message.id === "664398194431754242") {
      let memberRolesIdArray = [];
      let mem = await messageReaction.message.guild.fetchMember(user.id);
      if (mem) {
        mem.roles.map(r => {
          memberRolesIdArray.push(r.id);
        });
        for (let i = 0; i < memberRolesIdArray.length; i++) {
          if (memberRolesIdArray[i] === "664383363901030400") {
            memberRolesIdArray.splice(i, 1);
            memberRolesIdArray.push("664379969438482432");
            mem.setRoles(memberRolesIdArray).then(async () => {
              let c = await client.guilds
                .get("664351758344257537")
                .channels.get("664354657010843648");

              let img = await canvasLosersClubWelcome(
                mem.user.username,
                mem.user.avatarURL
              );
              const attachment = new Discord.Attachment(img, "welcome.png");
              c.send(attachment)
                .then(async () => {
                  let rolesC = await client.guilds
                    .get("664351758344257537")
                    .channels.get("664362973980000296");
                  let introC = await client.guilds
                    .get("664351758344257537")
                    .channels.get("664363153802657792");
                  c.send(
                    `Thank you for joining ${mem} ! <:softheart:575053165804912652>\nyou can get roles in ${rolesC} and make sure to do an intro in ${introC} !\n<@&681781904051273740>`
                  )
                    .then(msg => {
                      const filter = m =>
                        m.content
                          .toLowerCase()
                          .replace(/([^a-z])/g, "")
                          .indexOf("hi") >= 0 ||
                        m.content
                          .toLowerCase()
                          .replace(/([^a-z])/g, "")
                          .indexOf("hello") >= 0 ||
                        m.content
                          .toLowerCase()
                          .replace(/([^a-z])/g, "")
                          .indexOf("howareyou") >= 0 ||
                        m.content
                          .toLowerCase()
                          .replace(/([^a-z])/g, "")
                          .indexOf("howareu") >= 0 ||
                        m.content
                          .toLowerCase()
                          .replace(/([^a-z])/g, "")
                          .indexOf("welcome") >= 0 ||
                        m.content
                          .toLowerCase()
                          .replace(/([^a-z])/g, "")
                          .indexOf("bienvenue") >= 0 ||
                        m.content
                          .toLowerCase()
                          .replace(/([^a-z])/g, "")
                          .indexOf("yo") >= 0 ||
                        m.content
                          .toLowerCase()
                          .replace(/([^a-z])/g, "")
                          .indexOf("hey") >= 0 ||
                        m.content
                          .toLowerCase()
                          .replace(/([^a-z])/g, "")
                          .indexOf("hai") >= 0 ||
                        m.content
                          .toLowerCase()
                          .replace(/([^a-z])/g, "")
                          .indexOf("hail") >= 0 ||
                        m.content
                          .toLowerCase()
                          .replace(/([^a-z])/g, "")
                          .indexOf("nicetomeetyou") >= 0;
                      const collector = msg.channel.createMessageCollector(
                        filter,
                        { time: 120000 }
                      );
                      let userArray = [];
                      collector.on("collect", m => {
                        if (!userArray.includes(m.author.id))
                          userArray.push(m.author.id);
                      });
                      collector.on("end", async collected => {
                        let url = "";

                        for (let user in userArray) {
                          let query = `query {
                              getUser(guild_id: "${msg.guild.id}", user_id: "${userArray[user]}") {
                                guild_id user_id welcome_points
                              }
                            }`;
                          try {
                            let res = await request(url, query);
                            let points = res.getUser.welcome_points;
                            if (randomNum(1, 200) === 1) {
                              points += 10000;
                            } else {
                              points += randomNum(200, 300);
                            }
                            query = `mutation {
                              addWelcomePoints(guild_id: "${msg.guild.id}", user_id: "${userArray[user]}", welcome_points: ${points}) {
                                guild_id user_id welcome_points
                              }
                            }`;
                            try {
                              await request(url, query);
                            } catch (err) {
                              console.error(err);
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      });
                    })
                    .catch(err => console.error(err));
                })
                .catch(err => {
                  console.error(err);
                  return message.channel.send("help i broke something !!");
                });
            });
          }
        }
      } else {
        let s = await client.guilds.get("664351758344257537");
        s.fetchMember("664364035386507274")
          .then(m =>
            m.send(
              `${user.username} reacted but i failed to give them the new role`
            )
          )
          .catch(err => console.error(err));
      }
    }
    //---------------- rules react (losers club) --------------------------------------------------------------------------------------------
  }
  //---------------- rules react ------------------------------------------------------------------------------------------------------------
  //---------------- shipping ---------------------------------------------------------------------------------------------------------------
  else if (messageReaction._emoji.name === "softheart") {
    messageShipId.messageIds.map(msg => {
      if (messageReaction.message.id === msg.message_id) {
        messageReaction.message.reactions.map(async r => {
          if (r._emoji.name === "softheart") {
            if (r.count >= 5) {
              let url = "";

              let query = `mutation {
                    addShip(guild_id: "${
                      messageReaction.message.guild.id
                    }", user_id: "${msg.member_one_id}", ship_id: "${
                msg.member_two_id
              }", timestamp: "${Date.now()}") {
                      user_id ship_id timestamp
                    }
                  }`;
              try {
                let res = await request(url, query);
                query = `mutation {
                    addShip(guild_id: "${
                      messageReaction.message.guild.id
                    }", user_id: "${msg.member_two_id}", ship_id: "${
                  msg.member_one_id
                }", timestamp: "${Date.now()}") {
                      user_id ship_id timestamp
                    }
                  }`;
                try {
                  res = await request(url, query);
                  let m1 = await messageReaction.message.guild.fetchMember(
                    msg.member_one_id
                  );
                  let m2 = await messageReaction.message.guild.fetchMember(
                    msg.member_two_id
                  );
                  // message.channel.send(
                  //   `congrats ${m1} and ${m2} you are now shipped ! <:softheart:575053165804912652>`
                  // );
                  let img = await makeCanvasImage(
                    m1.user.avatarURL,
                    m2.user.avatarURL,
                    m1.user.username,
                    m2.user.username
                  );
                  const attachment = new Discord.Attachment(img, "ship.png");
                  messageReaction.message.channel
                    .send(attachment)
                    .then(() => {
                      messageReaction.message.channel.send(
                        `<a:star:662881975530422274>  **Congrats**  <a:star:662881975530422274>\n\n${m1} and ${m2} you are now shipped !`
                      );
                      messageShipId.deleteMessageIds(m1.id);
                    })
                    .catch(err => {
                      console.error(err);
                      return message.channel.send("help i broke something !!");
                    });
                } catch (err) {
                  console.error(err);
                }
              } catch (err) {
                console.error(err);
              }
            } else if (r.count >= 3) {
              let userArray = [];
              r.users.map(u => userArray.push(u.id));
              if (
                _.includes(userArray, msg.member_one_id) &&
                _.includes(userArray, msg.member_two_id)
              ) {
                let url = "";

                let query = `mutation {
                    addShip(guild_id: "${
                      messageReaction.message.guild.id
                    }", user_id: "${msg.member_one_id}", ship_id: "${
                  msg.member_two_id
                }", timestamp: "${Date.now()}") {
                      user_id ship_id timestamp
                    }
                  }`;
                try {
                  let res = await request(url, query);
                  query = `mutation {
                    addShip(guild_id: "${
                      messageReaction.message.guild.id
                    }", user_id: "${msg.member_two_id}", ship_id: "${
                    msg.member_one_id
                  }", timestamp: "${Date.now()}") {
                      user_id ship_id timestamp
                    }
                  }`;
                  try {
                    res = await request(url, query);
                    let m1 = await messageReaction.message.guild.fetchMember(
                      msg.member_one_id
                    );
                    let m2 = await messageReaction.message.guild.fetchMember(
                      msg.member_two_id
                    );
                    // message.channel.send(
                    //   `congrats ${m1} and ${m2} you are now shipped ! <:softheart:575053165804912652>`
                    // );
                    let img = await makeCanvasImage(
                      m1.user.avatarURL,
                      m2.user.avatarURL,
                      m1.user.username,
                      m2.user.username
                    );
                    const attachment = new Discord.Attachment(img, "ship.png");
                    messageReaction.message.channel
                      .send(attachment)
                      .then(() => {
                        messageReaction.message.channel.send(
                          `<a:star:662881975530422274>  **Congrats**  <a:star:662881975530422274>\n\n${m1} and ${m2} you are now shipped !`
                        );
                        messageShipId.deleteMessageIds(m1.id);
                      })
                      .catch(err => {
                        console.error(err);
                        return message.channel.send(
                          "help i broke something !!"
                        );
                      });
                  } catch (err) {
                    console.error(error);
                  }
                } catch (err) {
                  console.error(err);
                }
              }
            }
          }
        });
      }
    });
  }
  //---------------- shipping ---------------------------------------------------------------------------------------------------------------
  //---------------- info lists -------------------------------------------------------------------------------------------------------------
  else if (messageReaction._emoji.name === "➡️") {
    //---------------- info lists (member list) ---------------------------------------------------------------------------------------------
    if (
      user.id !== "601825955572350976" &&
      memberListHelper.memberList.length > 0 &&
      messageReaction.message.id === memberListHelper.memberList[0]
    ) {
      messageReaction.message.reactions.map(r => {
        r.message.reactions.forEach(reaction => reaction.remove(user.id));
      });

      if (
        memberListHelper.memberList[2].currentPage <
        memberListHelper.memberList[2].maxPage
      ) {
        let footerEnd = messageReaction.message.embeds[0].footer.text;
        footerEnd = footerEnd.substring(
          footerEnd.indexOf("/"),
          footerEnd.lenth
        );

        let newEmb = new Discord.RichEmbed().setAuthor(
          messageReaction.message.embeds[0].author.name
        );

        let memArray = memberListHelper.memberList[1];
        let newMemArray = _.takeRight(
          memArray,
          memArray.length - memberListHelper.memberList[2].currentPage * 25
        );

        if (_.size(newMemArray) > 25) {
          newMemArray = _.take(newMemArray, 25);
        }

        let strg = "";
        for (i in newMemArray) {
          strg += `${newMemArray[i].username} - ${formatDate(
            newMemArray[i].joinedTimestamp
          )}\n`;
        }
        newEmb.setDescription(strg);
        newEmb.setFooter(
          `Page ${memberListHelper.memberList[2].currentPage + 1} ${footerEnd}`
        );
        newEmb.setColor("#202225");
        messageReaction.message.edit(newEmb);
        memberListHelper.changePage(1);
      }
    }
    //---------------- info lists (member list) ---------------------------------------------------------------------------------------------
    //---------------- info lists (welcome points list) -------------------------------------------------------------------------------------
    else if (
      user.id !== "601825955572350976" &&
      welcomePointListHelper.welcomePointsArray.length > 0 &&
      messageReaction.message.id ===
        welcomePointListHelper.welcomePointsArray[0]
    ) {
      messageReaction.message.reactions.map(r => {
        r.message.reactions.forEach(reaction => reaction.remove(user.id));
      });

      if (
        welcomePointListHelper.welcomePointsArray[2].currentPage <
        welcomePointListHelper.welcomePointsArray[2].maxPage
      ) {
        let footerEnd = messageReaction.message.embeds[0].footer.text;
        footerEnd = footerEnd.substring(
          footerEnd.indexOf("/"),
          footerEnd.lenth
        );

        let newEmb = new Discord.RichEmbed().setAuthor(
          messageReaction.message.embeds[0].author.name
        );

        let welcomePointsArray = welcomePointListHelper.welcomePointsArray[1];
        let newWelcomePointsArray = _.takeRight(
          welcomePointsArray,
          welcomePointsArray.length -
            welcomePointListHelper.welcomePointsArray[2].currentPage * 25
        );

        if (_.size(newWelcomePointsArray) > 25) {
          newWelcomePointsArray = _.take(newWelcomePointsArray, 25);
        }

        let strg = "";
        for (i in newWelcomePointsArray) {
          strg += `**${newWelcomePointsArray[i].username} :** ${newWelcomePointsArray[i].welcome_points}\n`;
        }
        newEmb.setDescription(strg);
        newEmb.setFooter(
          `Page ${welcomePointListHelper.welcomePointsArray[2].currentPage +
            1} ${footerEnd}`
        );
        newEmb.setColor("#202225");
        messageReaction.message.edit(newEmb);
        welcomePointListHelper.changePage(1);
      }
    }
    //---------------- info lists (member list) ---------------------------------------------------------------------------------------------
  } else if (messageReaction._emoji.name === "⬅️") {
    //---------------- info lists (member list) ---------------------------------------------------------------------------------------------
    if (
      user.id !== "601825955572350976" &&
      memberListHelper.memberList.length > 0 &&
      messageReaction.message.id === memberListHelper.memberList[0]
    ) {
      messageReaction.message.reactions.map(r => {
        r.message.reactions.forEach(reaction => reaction.remove(user.id));
      });

      if (memberListHelper.memberList[2].currentPage > 1) {
        let footerEnd = messageReaction.message.embeds[0].footer.text;
        footerEnd = footerEnd.substring(
          footerEnd.indexOf("/"),
          footerEnd.lenth
        );

        let newEmb = new Discord.RichEmbed().setAuthor(
          messageReaction.message.embeds[0].author.name
        );

        let memArray = memberListHelper.memberList[1];

        let newMemArray = _.takeRight(
          memArray,
          memArray.length -
            (memberListHelper.memberList[2].currentPage - 2) * 25
        );

        newMemArray = _.take(newMemArray, 25);

        let strg = "";
        for (i in newMemArray) {
          strg += `${newMemArray[i].username} - ${formatDate(
            newMemArray[i].joinedTimestamp
          )}\n`;
        }
        newEmb.setDescription(strg);
        newEmb.setFooter(
          `Page ${memberListHelper.memberList[2].currentPage - 1} ${footerEnd}`
        );
        newEmb.setColor("#202225");
        messageReaction.message.edit(newEmb);
        memberListHelper.changePage(-1);
      }
    }
    //---------------- info lists (member list) ---------------------------------------------------------------------------------------------
    //---------------- info lists (welcome points list) -------------------------------------------------------------------------------------
    else if (
      user.id !== "601825955572350976" &&
      welcomePointListHelper.welcomePointsArray.length > 0 &&
      messageReaction.message.id ===
        welcomePointListHelper.welcomePointsArray[0]
    ) {
      messageReaction.message.reactions.map(r => {
        r.message.reactions.forEach(reaction => reaction.remove(user.id));
      });

      if (welcomePointListHelper.welcomePointsArray[2].currentPage > 1) {
        let footerEnd = messageReaction.message.embeds[0].footer.text;
        footerEnd = footerEnd.substring(
          footerEnd.indexOf("/"),
          footerEnd.lenth
        );

        let newEmb = new Discord.RichEmbed().setAuthor(
          messageReaction.message.embeds[0].author.name
        );

        let welcomePointsArray = welcomePointListHelper.welcomePointsArray[1];

        let newWelcomePointsArray = _.takeRight(
          welcomePointsArray,
          welcomePointsArray.length -
            (welcomePointListHelper.welcomePointsArray[2].currentPage - 2) * 25
        );

        newWelcomePointsArray = _.take(newWelcomePointsArray, 25);

        let strg = "";
        for (i in newWelcomePointsArray) {
          strg += `**${newWelcomePointsArray[i].username} :** ${newWelcomePointsArray[i].welcome_points}\n`;
        }
        newEmb.setDescription(strg);
        newEmb.setFooter(
          `Page ${welcomePointListHelper.welcomePointsArray[2].currentPage -
            1} ${footerEnd}`
        );
        newEmb.setColor("#202225");
        messageReaction.message.edit(newEmb);
        welcomePointListHelper.changePage(-1);
      }
    }
    //---------------- info lists (welcome points list) -------------------------------------------------------------------------------------
  }
  //---------------- info lists -------------------------------------------------------------------------------------------------------------
  //---------------- react roles ------------------------------------------------------------------------------------------------------------
  else if (user.id !== "601825955572350976") {
    //---------------- react roles (our home) -----------------------------------------------------------------------------------------------
    if (messageReaction.message.id === "663887669939535903") {
      //age roles
      let removeArray = [
        {
          id: "561441866525048842",
          name: "1️⃣"
        },
        {
          id: "561441985236434945",
          name: "2️⃣"
        },
        {
          id: "561442059567890442",
          name: "3️⃣"
        },
        {
          id: "561442124592054292",
          name: "4️⃣"
        },
        {
          id: "561442214572589077",
          name: "5️⃣"
        }
      ];
      if (messageReaction._emoji.name === "1️⃣") {
        await addRoleRemoveOthers(removeArray, "561441866525048842");
      } else if (messageReaction._emoji.name === "2️⃣") {
        await addRoleRemoveOthers(removeArray, "561441985236434945");
      } else if (messageReaction._emoji.name === "3️⃣") {
        await addRoleRemoveOthers(removeArray, "561442059567890442");
      } else if (messageReaction._emoji.name === "4️⃣") {
        await addRoleRemoveOthers(removeArray, "561442124592054292");
      } else if (messageReaction._emoji.name === "5️⃣") {
        await addRoleRemoveOthers(removeArray, "561442214572589077");
      }
    } else if (messageReaction.message.id === "663887880153989181") {
      //gender roles
      let removeArray = [
        {
          id: "663686604904464384", //girl
          name: "❤️"
        },
        {
          id: "663686449303912468", //boy
          name: "💙"
        },
        {
          id: "663686632548859914", //trans
          name: "trans"
        },
        {
          id: "663686679466606592", //non-binary
          name: "nonbinary"
        },
        {
          id: "663864213373976589", //cory
          name: "cory"
        },
        {
          id: "663864211667025962", //fruit
          name: "🍓"
        }
      ];
      if (messageReaction._emoji.name === "❤️") {
        await addRoleRemoveOthers(removeArray, "663686604904464384"); //girl
      } else if (messageReaction._emoji.name === "💙") {
        await addRoleRemoveOthers(removeArray, "663686449303912468"); //boy
      } else if (messageReaction._emoji.name === "trans") {
        await addRoleRemoveOthers(removeArray, "663686632548859914"); //trans
      } else if (messageReaction._emoji.name === "nonbinary") {
        await addRoleRemoveOthers(removeArray, "663686679466606592"); //non-binary
      } else if (messageReaction._emoji.name === "cory") {
        await addRoleRemoveOthers(removeArray, "663864213373976589"); //cory
      } else if (messageReaction._emoji.name === "🍓") {
        await addRoleRemoveOthers(removeArray, "663864211667025962"); //fruit
      }
    } else if (messageReaction.message.id === "663888106998464544") {
      //personality roles
      let removeArray = [
        {
          id: "561443343842934806",
          name: "🤐"
        },
        {
          id: "561443427107995660",
          name: "🥳"
        },
        {
          id: "561443500491800578",
          name: "😜"
        }
      ];
      if (messageReaction._emoji.name === "🤐") {
        await addRoleRemoveOthers(removeArray, "561443343842934806");
      } else if (messageReaction._emoji.name === "🥳") {
        await addRoleRemoveOthers(removeArray, "561443427107995660");
      } else if (messageReaction._emoji.name === "😜") {
        await addRoleRemoveOthers(removeArray, "561443500491800578");
      }
    } else if (messageReaction.message.id === "663888254017470483") {
      //gaming
      if (messageReaction._emoji.name === "🅿") {
        await addRole("561443526617989129");
      } else if (messageReaction._emoji.name === "❎") {
        await addRole("561443723330846722");
      } else if (messageReaction._emoji.name === "🍄") {
        await addRole("561443758487371776");
      } else if (messageReaction._emoji.name === "🖥") {
        await addRole("561443809712537625");
      } else if (messageReaction._emoji.name === "📱") {
        await addRole("561443842688155658");
      }
    } else if (messageReaction.message.id === "663888532959657988") {
      //relationship roles
      let removeArray = [
        {
          id: "561444125476651009",
          name: "💁‍♀️"
        },
        {
          id: "561444242778750978",
          name: "❤"
        },
        {
          id: "561444283400454146",
          name: "🙊"
        }
      ];
      if (messageReaction._emoji.name === "💁‍♀️") {
        await addRoleRemoveOthers(removeArray, "561444125476651009");
      } else if (messageReaction._emoji.name === "❤") {
        await addRoleRemoveOthers(removeArray, "561444242778750978");
      } else if (messageReaction._emoji.name === "🙊") {
        await addRoleRemoveOthers(removeArray, "561444283400454146");
      }
    } else if (messageReaction.message.id === "663888692573765634") {
      //dm roles
      let removeArray = [
        {
          id: "561443898266746893",
          name: "✅"
        },
        {
          id: "561444015472377876",
          name: "❌"
        },
        {
          id: "561444049828184074",
          name: "❓"
        }
      ];
      if (messageReaction._emoji.name === "✅") {
        await addRoleRemoveOthers(removeArray, "561443898266746893");
      } else if (messageReaction._emoji.name === "❌") {
        await addRoleRemoveOthers(removeArray, "561444015472377876");
      } else if (messageReaction._emoji.name === "❓") {
        await addRoleRemoveOthers(removeArray, "561444049828184074");
      }
    } else if (messageReaction.message.id === "663888853203157004") {
      //interests
      if (messageReaction._emoji.name === "🍲") {
        await addRole("561442784272318485");
      } else if (messageReaction._emoji.name === "🐕") {
        await addRole("561442865457135626");
      } else if (messageReaction._emoji.name === "🌄") {
        await addRole("561442912211042309");
      } else if (messageReaction._emoji.name === "⚽") {
        await addRole("561442956532514826");
      } else if (messageReaction._emoji.name === "🎵") {
        await addRole("561443003617509396");
      } else if (messageReaction._emoji.name === "🚗") {
        await addRole("561443031983587331");
      } else if (messageReaction._emoji.name === "📚") {
        await addRole("561443068927148034");
      } else if (messageReaction._emoji.name === "📺") {
        await addRole("561443115869798423");
      } else if (messageReaction._emoji.name === "💻") {
        await addRole("561443156642627611");
      } else if (messageReaction._emoji.name === "🌺") {
        await addRole("561443189123448842");
      } else if (messageReaction._emoji.name === "🖌️") {
        await addRole("561443216528769024");
      } else if (messageReaction._emoji.name === "🎮") {
        await addRole("561443255821271040");
      } else if (messageReaction._emoji.name === "👗") {
        await addRole("561443309667745805");
      }
    } else if (messageReaction.message.id === "663889028315217935") {
      //ping roles
      if (messageReaction._emoji.name === "🎙️") {
        await addRole("663148896046022707");
      } else if (messageReaction._emoji.name === "👋") {
        await addRole("672789435875590144");
      }
    }
    //---------------- react roles (our home) -----------------------------------------------------------------------------------------------
    //---------------- react roles (losers club ---------------------------------------------------------------------------------------------
    else if (messageReaction.message.id === "664779018481958943") {
      //age roles losers club
      let removeArray = [
        {
          id: "664369050180386816",
          name: "1️⃣"
        },
        {
          id: "664369352908341258",
          name: "2️⃣"
        },
        {
          id: "664369247660670986",
          name: "3️⃣"
        },
        {
          id: "664369323170856980",
          name: "4️⃣"
        }
      ];
      if (messageReaction._emoji.name === "1️⃣") {
        await addRoleRemoveOthers(removeArray, "664369050180386816");
      } else if (messageReaction._emoji.name === "2️⃣") {
        await addRoleRemoveOthers(removeArray, "664369352908341258");
      } else if (messageReaction._emoji.name === "3️⃣") {
        await addRoleRemoveOthers(removeArray, "664369247660670986");
      } else if (messageReaction._emoji.name === "4️⃣") {
        await addRoleRemoveOthers(removeArray, "664369323170856980");
      }
    } else if (messageReaction.message.id === "664779140892983316") {
      //gender roles
      let removeArray = [
        {
          id: "664368375669063690", //girl
          name: "❤️"
        },
        {
          id: "664368512042795037", //boy
          name: "💙"
        },
        {
          id: "664368600446009344", //trans
          name: "trans"
        },
        {
          id: "664368700673228800", //non-binary
          name: "nonbinary"
        }
      ];
      if (messageReaction._emoji.name === "❤️") {
        await addRoleRemoveOthers(removeArray, "664368375669063690"); //girl
      } else if (messageReaction._emoji.name === "💙") {
        await addRoleRemoveOthers(removeArray, "664368512042795037"); //boy
      } else if (messageReaction._emoji.name === "trans") {
        await addRoleRemoveOthers(removeArray, "664368600446009344"); //trans
      } else if (messageReaction._emoji.name === "nonbinary") {
        await addRoleRemoveOthers(removeArray, "664368700673228800"); //non-binary
      }
    } else if (messageReaction.message.id === "664779339035836417") {
      //age roles losers club
      let removeArray = [
        {
          id: "664374338950135829",
          name: "1️⃣"
        },
        {
          id: "664374615979720704",
          name: "2️⃣"
        },
        {
          id: "664374744816287764",
          name: "3️⃣"
        },
        {
          id: "664374774939516928",
          name: "4️⃣"
        },
        {
          id: "664374807353229313",
          name: "5️⃣"
        },
        {
          id: "664374834591039488",
          name: "6️⃣"
        },
        {
          id: "664374884666703882",
          name: "7️⃣"
        }
      ];
      if (messageReaction._emoji.name === "1️⃣") {
        await addRoleRemoveOthers(removeArray, "664374338950135829");
      } else if (messageReaction._emoji.name === "2️⃣") {
        await addRoleRemoveOthers(removeArray, "664374615979720704");
      } else if (messageReaction._emoji.name === "3️⃣") {
        await addRoleRemoveOthers(removeArray, "664374744816287764");
      } else if (messageReaction._emoji.name === "4️⃣") {
        await addRoleRemoveOthers(removeArray, "664374774939516928");
      } else if (messageReaction._emoji.name === "5️⃣") {
        await addRoleRemoveOthers(removeArray, "664374807353229313");
      } else if (messageReaction._emoji.name === "6️⃣") {
        await addRoleRemoveOthers(removeArray, "664374834591039488");
      } else if (messageReaction._emoji.name === "7️⃣") {
        await addRoleRemoveOthers(removeArray, "664374884666703882");
      }
    } else if (messageReaction.message.id === "664781016879333397") {
      //relationship roles
      let removeArray = [
        {
          id: "664372807219675136",
          name: "❤"
        },
        {
          id: "664372855668080642",
          name: "💘"
        },
        {
          id: "664374507904958515",
          name: "🖤"
        }
      ];
      if (messageReaction._emoji.name === "❤") {
        await addRoleRemoveOthers(removeArray, "664372807219675136");
      } else if (messageReaction._emoji.name === "💘") {
        await addRoleRemoveOthers(removeArray, "664372855668080642");
      } else if (messageReaction._emoji.name === "🖤") {
        await addRoleRemoveOthers(removeArray, "664374507904958515");
      }
    } else if (messageReaction.message.id === "664781128594620416") {
      //dm roles
      let removeArray = [
        {
          id: "664372172856360980",
          name: "⭕"
        },
        {
          id: "664372471331291168",
          name: "❌"
        },
        {
          id: "664372530848727040",
          name: "🚫"
        }
      ];
      if (messageReaction._emoji.name === "⭕") {
        await addRoleRemoveOthers(removeArray, "664372172856360980");
      } else if (messageReaction._emoji.name === "❌") {
        await addRoleRemoveOthers(removeArray, "664372471331291168");
      } else if (messageReaction._emoji.name === "🚫") {
        await addRoleRemoveOthers(removeArray, "664372530848727040");
      }
    } else if (messageReaction.message.id === "664781295624126484") {
      //interests 💢📚🐶🎨🎥💪🎮💤👀🎵🌺💾
      if (messageReaction._emoji.name === "💢") {
        await addRole("664370131941720064");
      } else if (messageReaction._emoji.name === "📚") {
        await addRole("664370960668950529");
      } else if (messageReaction._emoji.name === "🐶") {
        await addRole("664370501489262609");
      } else if (messageReaction._emoji.name === "🎨") {
        await addRole("664371305445064705");
      } else if (messageReaction._emoji.name === "🎥") {
        await addRole("664371984272064514");
      } else if (messageReaction._emoji.name === "💪") {
        await addRole("664370804305166347");
      } else if (messageReaction._emoji.name === "🎮") {
        await addRole("664370890737319950");
      } else if (messageReaction._emoji.name === "💤") {
        await addRole("664371616754565120");
      } else if (messageReaction._emoji.name === "👀") {
        await addRole("664371158304686080");
      } else if (messageReaction._emoji.name === "🎵") {
        await addRole("664371041635663902");
      } else if (messageReaction._emoji.name === "🌺") {
        await addRole("664370715813740554");
      } else if (messageReaction._emoji.name === "💾") {
        await addRole("664370841173229579");
      }
    } else if (messageReaction.message.id === "664781416764014604") {
      //vc role
      if (messageReaction._emoji.name === "🎙️") {
        await addRole("664372929982627850");
      } else if (messageReaction._emoji.name === "👋") {
        await addRole("681781904051273740");
      }
    } else if (messageReaction.message.id === "664781943019143172") {
      //vc role
      if (messageReaction._emoji.name === "🔞") {
        let memberRolesIdArray = [];
        let mem = await messageReaction.message.guild.fetchMember(user.id);
        if (mem) {
          await mem.roles.map(r => {
            memberRolesIdArray.push(r.id);
          });
          if (
            memberRolesIdArray.includes("664379969438482432") &&
            !memberRolesIdArray.includes("664373343771688981")
          ) {
            mem.send(
              `sorry but you are not a high enough level to get the nsfw role !`
            );
          } else {
            await addRole("664392387367272460");
            let msgEmbed = new Discord.RichEmbed()
              .setAuthor("NSFW rules")
              .setDescription(
                `I. Posting NSFW images outside of designated sections is not allowed.\n\nII. #nsfw-selfies must be your own photos of you and no one else.\n\nIII. All comments for nsfw selfies/nsfw chat goes into #nsfw-chat.\n\nIV. Be respectful, you are an adult.\n\nV. If there is any questions of you being underage you will be banned.\n\nVI. If someone is giving you a problem, please DM a staff member.\n\nVII. Remember DMs exist <3.`
              )
              .setColor("#202225");
            mem.send(msgEmbed);
          }
        }
      }
    }
    //---------------- react roles (losers club ---------------------------------------------------------------------------------------------
  }
  //---------------- react roles ------------------------------------------------------------------------------------------------------------
  //---------------- star board image check -------------------------------------------------------------------------------------------------
  function extension(messageReaction, attachment) {
    const imageLink = attachment.split(".");
    const typeOfImage = imageLink[imageLink.length - 1];
    const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
    if (!image) return "";
    return attachment;
  }
  //---------------- star board image check -------------------------------------------------------------------------------------------------
  //---------------- shipping canvas --------------------------------------------------------------------------------------------------------
  async function makeCanvasImage(avatarURL1, avatarURL2, username1, username2) {
    const canvas = Canvas.createCanvas(450, 259);

    const ctx = canvas.getContext("2d");

    let txt = `${username1.replace(/([^A-Za-z])/g, "")}  &  ${username2.replace(
      /([^A-Za-z])/g,
      ""
    )}`;

    let ttfPath = path.join(__dirname, "../fonts/birds.ttf");

    Canvas.registerFont(ttfPath, { family: "birds" });
    ctx.textAlign = "center";

    ctx.font = "30px birds";
    ctx.lineWidth = 3;
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";
    let txtWidth = ctx.measureText(txt).width;

    let reqPath = path.join(__dirname, "../images/ship_finish.png");
    const background = await Canvas.loadImage(reqPath);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(140, 79, 58, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.arc(259, 113, 58, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.strokeText(`${txt}`, 225, 245);
    ctx.fillText(`${txt}`, 225, 245);
    ctx.clip();

    // let shipFont = await opentype.loadSync(ttfPath);

    const { body: buffer1 } = await snekfetch.get(avatarURL1);
    const avatar1 = await Canvas.loadImage(buffer1);
    await ctx.drawImage(avatar1, 82, 21, 115, 115);

    const { body: buffer2 } = await snekfetch.get(avatarURL2);
    const avatar2 = await Canvas.loadImage(buffer2);
    await ctx.drawImage(avatar2, 201, 55, 115, 115);
    // let fontPath = shipFont.getPath(txt, 0, 200, 26);
    // fontPath.draw(ctx);

    return canvas.toBuffer();
  }
  //---------------- shipping canvas --------------------------------------------------------------------------------------------------------
  //---------------- canvas for losers club welcome message ---------------------------------------------------------------------------------
  async function canvasLosersClubWelcome(name, avatarURL) {
    const canvas = Canvas.createCanvas(950, 350);

    const ctx = canvas.getContext("2d");

    let ttfPath = path.join(__dirname, "../fonts/Archivo.ttf");

    Canvas.registerFont(ttfPath, { family: "arch" });
    ctx.textAlign = "left";

    ctx.font = "72px arch";
    ctx.lineWidth = 3;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "#36393f";

    let reqPath = path.join(__dirname, "../images/losers_club_welcome.png");
    const background = await Canvas.loadImage(reqPath);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.rect(25, 25, 36, 300);
    ctx.closePath();

    ctx.rect(91, 25, 36, 300);
    ctx.closePath();

    ctx.rect(157, 25, 36, 300);
    ctx.closePath();

    ctx.rect(223, 25, 36, 300);
    ctx.closePath();

    ctx.rect(289, 25, 36, 300);
    ctx.closePath();

    ctx.strokeText(
      `${name.replace(/([^A-Za-z\s.,()-_:;'"+-])/g, "")}`,
      382,
      196
    );
    ctx.fillText(`${name.replace(/([^A-Za-z\s.,()-_:;'"+-])/g, "")}`, 382, 196);

    ctx.clip();

    const { body: buffer } = await snekfetch.get(avatarURL);
    const avatar = await Canvas.loadImage(buffer);
    await ctx.drawImage(avatar, 25, 25, 300, 300);

    return canvas.toBuffer();
  }
  //---------------- canvas for losers club welcome message ---------------------------------------------------------------------------------
  //---------------- remove reactions for star board and react roles ------------------------------------------------------------------------
  async function removeReaction(base, messageId, emoteName) {
    let oriMsg = await messageReaction.message.channel.fetchMessage(messageId);
    await oriMsg.reactions.map(r => {
      r.message.reactions.forEach(async reaction => {
        if (reaction._emoji.name === emoteName) {
          return await reaction.remove(user.id);
        }
      });
    });
    return;
  }
  //---------------- remove reactions for star board and react roles ------------------------------------------------------------------------
  //---------------- react roles add and remove roles ---------------------------------------------------------------------------------------
  async function addRoleRemoveOthers(removeArray, roleToAdd) {
    let memberRolesIdArray = [];
    let mem = await messageReaction.message.guild.fetchMember(user.id);
    if (mem) {
      await mem.roles.map(r => {
        memberRolesIdArray.push(r.id);
      });
      for (let i = 0; i < memberRolesIdArray.length; i++) {
        for (let j = 0; j < removeArray.length; j++) {
          if (memberRolesIdArray[i] === removeArray[j].id) {
            memberRolesIdArray.splice(i, 1);
            await removeReaction(
              messageReaction,
              messageReaction.message.id,
              removeArray[j].name
            );
          }
        }
      }
      memberRolesIdArray.push(roleToAdd);
      // await mem.addRole(roleToAdd);

      return await mem.setRoles(memberRolesIdArray);
    }
  }
  async function addRole(roleToAdd) {
    let mem = await messageReaction.message.guild.fetchMember(user.id);
    if (mem) {
      return await mem.addRole(roleToAdd);
    }
  }
  //---------------- react roles add and remove roles ---------------------------------------------------------------------------------------
  //---------------- formatting dates for lists ---------------------------------------------------------------------------------------------
  function formatDate(date) {
    moment.locale("fr");
    return moment(new Date(Number(date)).toISOString()).format("D MMM YYYY");
  }
  //---------------- formatting dates for lists ---------------------------------------------------------------------------------------------
};
