const Discord = require("discord.js");
const randomColor = require("../../data/randomColor");
const {
  request
} = require("graphql-request");
const moment = require("moment");
const schedule = require("node-schedule");

exports.run = async (client, message, args) => {
  let url = "";

  let query = `query {
            getUser(guild_id: "${message.guild.id}", user_id: "${message.author.id}") {
              guild_id user_id welcome_points temp_role
            }
          }`;
  try {
    let user = await request(url, query);
    if (user.getUser.welcome_points >= 10000) {
      message.channel
        .send(`What would you like to buy ? you have **${user.getUser.welcome_points} points** !\n\n**1 :** 10.000 - 1 month custom role\n**2 :** 50.000 - permanent custom role\n\nplease respond with 1 or 2`)
        .then(() => {
          message.channel
            .awaitMessages(res => res.author.id === message.author.id, {
              maxMatches: 1,
              time: 60000,
              errors: ["time"]
            })
            .then(async collected => {
              if (collected.first().content === "1") {
                if (user.getUser.temp_role && user.getUser.temp_role.length > 0) {
                  let role = await message.guild.roles.get(user.getUser.temp_role);
                  message.channel
                    .send(
                      `would you like to renew the role ${role} ?? (yes / no)`
                    )
                    .then(() => {
                      message.channel
                        .awaitMessages(res => res.author.id === message.author.id, {
                          maxMatches: 1,
                          time: 60000,
                          errors: ["time"]
                        })
                        .then(async collected => {
                          if (collected.first().content.toLowerCase() === "yes" ||
                            collected.first().content.toLowerCase() === "y"
                          ) {
                            query = `query {
                                  getSchedules {
                                  guild_id channel_id user_id dm_user message date
                                  }
                                  }`;
                            try {
                              res = await request(url, query);
                              for (let i in res.getSchedules) {
                                if (res.getSchedules[i].message === `roleremove ${role.id}`) {
                                  let date = new Date(res.getSchedules[i].date);
                                  let newDateObj = moment(date)
                                    .add(30, "d")
                                    .toDate();
                                  query = `mutation {
                                      deleteSchedules(guild_id: "${res.getSchedules[i].guild_id}", message: "${res.getSchedules[i].message}", date: "${res.getSchedules[i].date}"){
                                      guild_id
                                      }
                                      }`;
                                  try {
                                    await request(url, query);
                                    query = `mutation {
                                          addSchedules(guild_id: "${message.guild.id}", user_id: "${message.author.id}", message: "roleremove ${role.id}", date: "${moment(newDateObj)}") {
                                            message
                                          }
                                          }`;
                                    try {
                                      await request(url, query);
                                      await message.channel.send(`done ! i added a month to the role for you !\nyou have ${Number(user.getUser.welcome_points) - 10000} points left now !`);
                                      let c = await client.channels.get("561372938474094603");
                                      let embed = new Discord.RichEmbed()
                                        .setDescription(`**${message.author.username}** just renewed a **1 month** custom role !\n\n**Role :** ${role}`)
                                        .setColor(randomColor());
                                      c.send(embed);
                                      query = `mutation {
                                      addWelcomePoints(guild_id: "${message.guild.id}", user_id: "${message.author.id}", welcome_points: ${Number(user.getUser.welcome_points) - 10000}) {
                                        guild_id user_id welcome_points
                                      }
                                      }`;
                                      try {
                                        await request(url, query);
                                        schedule.scheduleJob(newDateObj, async () => {
                                          let roleArray = message.member._roles;
                                          for (let i in roleArray) {
                                            if (roleArray[i] === role.id) {
                                              roleArray.splice(i, 1);
                                              message.member.setRoles(roleArray);
                                            }
                                          }
                                        });
                                      } catch (err) {
                                        console.error(err)
                                      }
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          } else if (
                            collected.first().content.toLowerCase() === "no" ||
                            collected.first().content.toLowerCase() === "n"
                          ) {
                            message.channel
                              .send(`so you want to by a new 1 month role for 10.000 !\nwhat do you want the name of it to be ??`)
                              .then(() => {
                                message.channel
                                  .awaitMessages(res => res.author.id === message.author.id, {
                                    maxMatches: 1,
                                    time: 120000,
                                    errors: ["time"]
                                  })
                                  .then(
                                    async collected => {
                                      let roleName = collected.first().content;
                                      message.channel
                                        .send(`what colour do you want it to be ?\ni prefer hex values like #fdd1ff !!`)
                                        .then(() => {
                                          message.channel
                                            .awaitMessages(res => res.author.id === message.author.id, {
                                              maxMatches: 1,
                                              time: 60000,
                                              errors: [
                                                "time"
                                              ]
                                            })
                                            .then(async collected => {
                                              let roleColour = collected
                                                .first()
                                                .content.replace(/([\s])/g, "");
                                              message.guild
                                                .createRole({
                                                  name: roleName,
                                                  color: roleColour,
                                                  hoist: true,
                                                  position: 75
                                                })
                                                .then(
                                                  async role => {
                                                    await message.member.addRole(role.id);
                                                    await message.channel.send(`done ! enjoy your new role !\nyou have ${Number(user.getUser.welcome_points) - 10000} points left now !`);
                                                    let c = await client.channels.get("561372938474094603");
                                                    let embed = new Discord.RichEmbed()
                                                      .setDescription(`**${message.author.username}** just bought a **1 month** custom role !\n\n**Role :** ${role}`)
                                                      .setColor(randomColor());
                                                    c.send(embed);
                                                    query = `mutation {
                                                        addWelcomePoints(guild_id: "${message.guild.id}", user_id: "${message.author.id}", welcome_points: ${Number(user.getUser.welcome_points) - 10000}) {
                                                        guild_id user_id welcome_points
                                                        }
                                                        }`;
                                                    try {
                                                      await request(url, query);
                                                      let date = new Date();
                                                      let newDateObj = moment(date)
                                                        .add(30, "d")
                                                        .toDate();

                                                      query = `mutation {
                                                          addSchedules(guild_id: "${message.guild.id}", user_id: "${message.author.id}", message: "roleremove ${role.id}", date: "${moment(newDateObj)}") {
                                                              message
                                                          }
                                                          }`;

                                                      try {
                                                        await request(url, query);
                                                        query = `mutation {
                                                            setTempRole(guild_id: "${message.guild.id}", user_id: "${message.author.id}", temp_role: "${role.id}") {
                                                              temp_role
                                                            }
                                                            }`;
                                                        try {
                                                          await request(url, query);
                                                          schedule.scheduleJob(newDateObj, async () => {
                                                            let roleArray = message.member._roles;
                                                            for (let i in roleArray) {
                                                              if (roleArray[i] === role.id) {
                                                                roleArray.splice(i, 1);
                                                                message.member.setRoles(roleArray);
                                                              }
                                                            }
                                                          });
                                                        } catch (err) {
                                                          console.error(err);
                                                        }
                                                      } catch (err) {
                                                        console.error(err);
                                                      }
                                                    } catch (err) {
                                                      console.error(err);
                                                    }
                                                  }
                                                )
                                                .catch(
                                                  console.error
                                                );
                                            });
                                        });
                                    }
                                  );
                              });
                          }
                        });
                    }).catch(err=>console.error(err))
                } else {
                  message.channel
                    .send(`so you want to by the 1 month role for 10.000 !\nwhat do you want the name of it to be ??`)
                    .then(() => {
                      message.channel
                        .awaitMessages(
                          res => res.author.id === message.author.id,
                          {
                            maxMatches: 1,
                            time: 120000,
                            errors: ["time"]
                          }
                        )
                        .then(async collected => {
                          let roleName = collected.first().content;
                          message.channel
                            .send(
                              `what colour do you want it to be ?\ni prefer hex values like #fdd1ff !!`
                            )
                            .then(() => {
                              message.channel
                                .awaitMessages(
                                  res => res.author.id === message.author.id,
                                  {
                                    maxMatches: 1,
                                    time: 120000,
                                    errors: ["time"]
                                  }
                                )
                                .then(async collected => {
                                  let roleColour = collected
                                    .first()
                                    .content.replace(/([\s])/g, "");
                                  message.guild
                                    .createRole({
                                      name: roleName,
                                      color: roleColour,
                                      hoist: true,
                                      position: 81
                                    })
                                    .then(async role => {
                                      await message.member.addRole(role.id);
                                      await message.channel.send(
                                        `done ! enjoy your new role !\nyou have ${Number(
                                          user.getUser.welcome_points
                                        ) - 10000} points left now !`
                                      );
                                      let c = await client.channels.get(
                                        "561372938474094603"
                                      );
                                      let embed = new Discord.RichEmbed()
                                        .setAuthor("Rôle acheté")
                                        .setDescription(
                                          `**${message.author.username}**#${message.author.discriminator} just bought a **1 month** custom role !\n\n**Role :** ${role}`
                                        )
                                        .setThumbnail(
                                          message.author.displayAvatarURL
                                        )
                                        .setColor(randomColor())
                                        .setFooter(
                                          `${message.guild.name}`,
                                          "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
                                        )
                                        .setTimestamp();
                                      c.send(embed);
                                      query = `mutation {
                                      addWelcomePoints(guild_id: "${
                                        message.guild.id
                                      }", user_id: "${
                                        message.author.id
                                      }", welcome_points: ${Number(
                                        user.getUser.welcome_points
                                      ) - 10000}) {
                                        guild_id user_id welcome_points
                                      }
                                    }`;
                                      try {
                                        await request(url, query);
                                        let date = new Date();
                                        let newDateObj = moment(date)
                                          .add(30, "d")
                                          .toDate();

                                        query = `mutation {
                                          addSchedules(guild_id: "${
                                            message.guild.id
                                          }", user_id: "${
                                          message.author.id
                                        }", message: "roleremove ${
                                          role.id
                                        }", date: "${moment(newDateObj)}") {
                                          message
                                          }
                                          }`;
                                        try {
                                          await request(url, query);
                                          query = `mutation {
                                          setTempRole(guild_id: "${message.guild.id}", user_id: "${message.author.id}", temp_role: "${role.id}") {
                                          temp_role
                                          }
                                          }`;
                                          try {
                                            await request(url, query);
                                            schedule.scheduleJob(
                                              newDateObj,
                                              async () => {
                                                let roleArray =
                                                  message.member._roles;
                                                for (let i in roleArray) {
                                                  if (
                                                    roleArray[i] === role.id
                                                  ) {
                                                    roleArray.splice(i, 1);
                                                    message.member.setRoles(
                                                      roleArray
                                                    );
                                                  }
                                                }
                                              }
                                            );
                                          } catch (err) {
                                            console.error(err);
                                          }
                                        } catch (err) {
                                          console.error(err);
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    })
                                    .catch(console.error);
                                })
                                .catch(() => {
                                  return message.channel.send(
                                    "sorry but i timed out !! you can always try again with the same command !"
                                  );
                                });
                            }).catch(err => console.error(err))
                        })
                        .catch(() => {
                          return message.channel.send(
                            "sorry but i timed out !! you can always try again with the same command !"
                          );
                        });
                    });
                }
              } else if (collected.first().content === "2") {
                if (user.getUser.welcome_points >= 50000) {
                  message.channel.send(`so you want to by the permanent role for 50.000 !\nwhat do you want the name of it to be ??`)
                    .then(() => {
                      message.channel
                        .awaitMessages(
                          res => res.author.id === message.author.id,
                          {
                            maxMatches: 1,
                            time: 60000,
                            errors: ["time"]
                          }
                        )
                        .then(async collected => {
                          let roleName = collected.first().content;
                          message.channel
                            .send(
                              `what colour do you want it to be ?\ni prefer hex values like #fdd1ff !!`
                            )
                            .then(() => {
                              message.channel
                                .awaitMessages(
                                  res => res.author.id === message.author.id,
                                  {
                                    maxMatches: 1,
                                    time: 60000,
                                    errors: ["time"]
                                  }
                                )
                                .then(async collected => {
                                  let roleColour = collected
                                    .first()
                                    .content.replace(/([\s])/g, "");
                                  message.guild
                                    .createRole({
                                      name: roleName,
                                      color: roleColour,
                                      hoist: true,
                                      position: 81
                                    })
                                    .then(async role => {
                                      await message.member.addRole(role.id);
                                      await message.channel.send(
                                        `done ! enjoy your new role !\nyou have ${Number(
                                          user.getUser.welcome_points
                                        ) - 50000} points left !`
                                      );
                                      let c = await client.channels.get(
                                        "561372938474094603"
                                      );
                                      let embed = new Discord.RichEmbed()
                                        .setAuthor("Rôle acheté")
                                        .setDescription(
                                          `**${message.author.username}**#${message.author.discriminator} just bought a **permanent** custom role !\n\n**Role :** ${role}`
                                        )
                                        .setThumbnail(
                                          message.author.displayAvatarURL
                                        )
                                        .setColor(randomColor())
                                        .setFooter(
                                          `${message.guild.name}`,
                                          "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
                                        )
                                        .setTimestamp();
                                      c.send(embed);

                                      query = `mutation {
                                        addWelcomePoints(guild_id: "${
                                          message.guild.id
                                        }", user_id: "${
                                        message.author.id
                                      }", welcome_points: ${Number(
                                        user.getUser.welcome_points
                                      ) - 50000}) {
                                        guild_id user_id welcome_points
                                        }
                                        }`;
                                      try {
                                        await request(url, query);
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    })
                                    .catch(console.error);
                                })
                                .catch(() => {
                                  return message.channel.send(
                                    "sorry but i timed out !! you can always try again with the same command !"
                                  );
                                });
                            }).catch(err => console.error(err))
                        })
                        .catch(() => {
                          return message.channel.send(
                            "sorry but i timed out !! you can always try again with the same command !"
                          );
                        });
                    });
                } else {
                  message.channel.send(
                    `you dont have enough points ! you need 50.000 ! you need **${50000 -
                      Number(user.getUser.welcome_points)} more** !`
                  ).catch(err => console.error(err))
                }
              }
            });
        });
    } else {
      message.channel.send(
        `sorry but the cheapest thing in the store is 10.000 points ! you only have ${user.getUser.welcome_points}`
      ).catch(err => console.error(err))
    }
  } catch (err) {
    console.error(err);
  }
};