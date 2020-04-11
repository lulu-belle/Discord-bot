const Discord = require("discord.js");
const _ = require("lodash");
const { request } = require("graphql-request");
let messageShipId = require("../../data/messageShipId");
const Canvas = require("canvas");
const path = require("path");
const snekfetch = require("snekfetch");
const moment = require("moment");

exports.run = async (client, message, args) => {
  if (
    message.channel.id === "561453542741901322" &&
    message.author.id !== "157673412561469440" &&
    message.author.id !== "630573404352937996"
  ) {
    message.channel.send("sorry but i'm not allowed in here anymore !");
    message.channel.send("<a:crying:661358360091688980>");
  } else {
    let member = null;
    let url = "";

    if (
      args.length === 1 ||
      args[1].toLowerCase() === "list" ||
      args[1].toLowerCase() === "lists"
    ) {
      let query = `{
            getShips(guild_id: "${message.guild.id}") {
              user_id ship_id timestamp
            }
          }`;
      try {
        let res = await request(url, query);
        if (res.getShips === null || res.getShips.length === 0) {
          message.channel
            .send("there are no ships in the serveur !")
            .catch(err => {
              console.error(err);
            });
        } else {
          let msgBase = "";
          // await res.getShips.map(async ship => {
          //   console.log(ship);
          //   let m1 = await message.guild.fetchMember(ship.user_id);
          //   let m2 = await message.guild.fetchMember(ship.ship_id);
          //   console.log(msgBase.indexOf(m1.user.username));
          //   if (msgBase.indexOf(m1.user.username) === -1) {
          //     msgBase += `${m1.user.username} + ${m2.user.username}\n`;
          //   }
          // });

          await Promise.all(
            _.map(res.getShips, async ship => {
              if (
                message.guild.member(ship.user_id) &&
                message.guild.member(ship.ship_id)
              ) {
                let m1 = await message.guild.fetchMember(ship.user_id);
                let m2 = await message.guild.fetchMember(ship.ship_id);
                if (msgBase.indexOf(m1.user.username) === -1) {
                  moment.locale("fr");
                  let shipDate = moment(
                    new Date(Number(ship.timestamp)).toISOString()
                  ).format("D MMM YYYY");
                  return (msgBase += `${m1.user.username} + ${m2.user.username} - ${shipDate}\n`);
                }
              }
              return;
            })
          );
          let messageEmbed = new Discord.RichEmbed()
            .setColor("#202225")
            .setAuthor("Ship list")
            .setDescription(msgBase);

          return message.channel.send(messageEmbed).catch(err => {
            console.error(err);
          });
        }
      } catch (err) {
        console.error(err);
        message.channel.send("i broke something").catch(err => {
          console.error(err);
        });
        return message.channel
          .send("<:deadinside:606350795881054216>")
          .catch(err => {
            console.error(err);
          });
      }
    } else if (_.size(message.mentions.members) === 1) {
      if (args.length !== new Set(args).size) {
        if (message.author.id === message.mentions.members.first().user.id) {
          message.channel
            .send("why are you trying to ship you with yourself weirdo !!")
            .catch(err => {
              console.error(err);
            });
          return message.channel
            .send("<:monoeil:658912400996827146>")
            .catch(err => {
              console.error(err);
            });
        } else {
          return message.channel
            .send("you cannot ship a person with themselves !! that is weird !")
            .catch(err => console.error(err));
        }
      }
      //get ship status
      if (message.mentions.members.first().user.id === "601825955572350976") {
        message.channel
          .send("i'm a bot, i dont need a boy")
          .catch(err => console.error(err));
        return message.channel
          .send("<:scared:658963912099758080>")
          .catch(err => console.error(err));
      }
      let query = `{
            getShip(guild_id: "${message.guild.id}", user_id: "${
        message.mentions.members.first().user.id
      }") {
              user_id ship_id timestamp
            }
          }`;
      try {
        let res = await request(url, query);
        if (res.getShip === null) {
          message.channel
            .send(
              `${
                message.mentions.members.first().user.username
              } is not shipped with anyone !\nwe should find them someone !!`
            )
            .catch(err => console.error(err));
          message.channel
            .send("<:natsukiExcited:646210701110804481>")
            .catch(err => console.error(err));
          // message.channel
          //   .send(`${message.mentions.members.first().user.username} is not shipped with anyone !\ndo you want to ship them with someone ?`)
          //   .then(m => {
          //     message.channel.awaitMessages(res => res.author.id === message.author.id, {
          //         max: 1,
          //         time: 60000,
          //         errors: ["time"]
          //       })
          //       .then(collected => {
          //         if (collected.first().content.toLowerCase().replace(/\s/g, "") === "y" ||
          //           collected.first().content.toLowerCase().replace(/\s/g, "").indexOf("yes") >= -1 ||
          //           collected.first().content.toLowerCase().replace(/\s/g, "").indexOf("yeah") >= -1 ||
          //           collected.first().content.toLowerCase().replace(/\s/g, "").indexOf("yep") >= -1
          //         ) {
          //           message.channel.send("who do you want to ship them with ??")
          //             .then(m => {
          //               message.channel.awaitMessages(res => res.author.id === message.author.id,
          //                   {
          //                     max: 1,
          //                     time: 60000,
          //                     errors: ["time"]
          //                   }
          //                 )
          //                 .then(async collected => {
          //                   if (collected.first().author.id === message.author.id) {
          //                     return message.channel.send("you cannot ship you with yourself weirdo !");
          //                   } else {
          //                     query = `{
          //                             getShip(guild_id: "${
          //                               message.guild.id
          //                             }", user_id: "${
          //                       collected.first().author.id
          //                     }") {
          //                                 user_id ship_id timestamp
          //                             }
          //                         }`;
          //                     try {
          //                       res = await request(url, query);
          //                       console.log(res);
          //                       if (res.getShip === null) {
          //                         message.channel
          //                           .send(
          //                             `${memberOne.user.username} x ${
          //                               collected.first().author.username
          //                             }`
          //                           )
          //                           .then(m => {
          //                             m.react("575053165804912652");
          //                             messageShipId.addMessageId(m.id);
          //                           });
          //                       } else {
          //                         message.channel.send(`${collected.first().author.username} is already shipped with ${res.getShip.ship_id}`);
          //                         console.log(res.getShip);
          //                       }
          //                     } catch (err) {
          //                       console.error(err);
          //                       message.channel.send("i broke something");
          //                       return message.channel.send("<:deadinside:606350795881054216>");
          //                     }
          //                   }
          //                 });
          //             });
          //         }
          //       });
          //   });
        } else {
          let m = await message.guild.fetchMember(res.getShip.ship_id);
          if (m) {
            message.channel
              .send(
                `sorry but ${
                  message.mentions.members.first().user.username
                } is already shipped with ${m.user.username} !`
              )
              .catch(err => console.error(err));
          } else {
            message.channel
              .send(
                `sorry but ${
                  message.mentions.members.first().user.username
                } is already shipped with someone else !`
              )
              .catch(err => console.error(err));
          }
          return console.log(res.getShip);
        }
      } catch (err) {
        console.error(err);
        message.channel
          .send("i broke something")
          .catch(err => console.error(err));
        return message.channel
          .send("<:deadinside:606350795881054216>")
          .catch(err => console.error(err));
      }
    } else if (_.size(message.mentions.members) === 2) {
      let memberArray = [];
      message.mentions.members.map(m => memberArray.push(m));
      if (
        memberArray[0].user.id === "601825955572350976" ||
        memberArray[1].user.id === "601825955572350976"
      ) {
        if (
          message.author.id === memberArray[0].user.id ||
          message.author.id === memberArray[1].user.id
        ) {
          message.channel
            .send("i'm not a real boy, you cannot be shipped with me weirdo")
            .catch(err => console.error(err));
          message.channel
            .send("<:scared:658963912099758080>")
            .catch(err => console.error(err));
          return setTimeout(() => {
            message.author
              .send("<:yes:660599155378618371>")
              .catch(err => console.error(err));
          }, 1500);
        } else {
          message.channel
            .send("i'm a bot, i dont need a boy")
            .catch(err => console.error(err));
          return message.channel
            .send("<:scared:658963912099758080>")
            .catch(err => console.error(err));
        }
      } else {
        //check if both can be shipped
        let query = `{
            getShip(guild_id: "${message.guild.id}", user_id: "${memberArray[0].user.id}") {
              user_id ship_id timestamp
            }
          }`;
        try {
          let res1 = await request(url, query);
          console.log(res1);
          if (res1.getShip === null) {
            query = `{
            getShip(guild_id: "${message.guild.id}", user_id: "${memberArray[1].user.id}") {
              user_id ship_id timestamp
            }
          }`;
            try {
              let res2 = await request(url, query);
              console.log(res2);
              if (res2.getShip === null) {
                if (memberArray.length === 2) {
                  let img = await makeCanvasImage(
                    memberArray[0].user.avatarURL,
                    memberArray[1].user.avatarURL
                  );
                  const attachment = new Discord.Attachment(img, "ship.png");
                  message.channel
                    .send(attachment)
                    .then(() => {
                      message.channel
                        .send(
                          `🚢  **New Ship**  🚢\n\n**${memberArray[0]}** <:softheart:575053165804912652> **${memberArray[1]}**\n\nBoth people please click the heart reaction below to confirm ship\n- or -\n5 people in the server can react with the heart to confirm ship`
                        )
                        .then(m => {
                          m.react("575053165804912652").catch(err =>
                            console.error(err)
                          );
                          messageShipId.addMessageId(
                            m.id,
                            memberArray[0].user.id,
                            memberArray[1].user.id
                          );
                        })
                        .catch(err => console.error(err));
                    })
                    .catch(err => console.error(err));
                }
              } else {
                //list current ship status, like with who and when
                console.log(res2.getShip);
                let m = await message.guild.fetchMember(res2.getShip.ship_id);
                if (m) {
                  message.channel
                    .send(
                      `sorry but ${memberArray[1].user.username} is already shipped with ${m.user.username} !`
                    )
                    .catch(err => console.error(err));
                } else {
                  message.channel
                    .send(
                      `sorry but ${memberArray[1].user.username} is already shipped with someone else !`
                    )
                    .catch(err => console.error(err));
                }
                return console.log(res2.getShip);
              }
            } catch (err) {
              console.error(err);
              message.channel
                .send("i broke something")
                .catch(err => console.error(err));
              return message.channel
                .send("<:deadinside:606350795881054216>")
                .catch(err => console.error(err));
            }
          } else {
            //list current ship status, like with who and when
            let m = await message.guild.fetchMember(res1.getShip.ship_id);
            if (m) {
              message.channel
                .send(
                  `sorry but ${memberArray[0].user.username} is already shipped with ${m.user.username} !`
                )
                .catch(err => console.error(err));
            } else {
              message.channel
                .send(
                  `sorry but ${memberArray[0].user.username} is already shipped with someone else !`
                )
                .catch(err => console.error(err));
            }
            return console.log(res1.getShip);
          }
        } catch (err) {
          console.error(err);
          message.channel
            .send("i broke something")
            .catch(err => console.error(err));
          return message.channel
            .send("<:deadinside:606350795881054216>")
            .catch(err => console.error(err));
        }
      }
    } else if (_.size(message.mentions.members) > 2) {
      message.channel
        .send("you cannot ship more than 2 people weirdo !")
        .catch(err => console.error(err));
      return message.channel
        .send("<:nicoSIPP:606364812561219594>")
        .catch(err => console.error(err));
    } else if (
      args[1].toLowerCase() === "leave" ||
      args[1].toLowerCase() === "breakup" ||
      args[1].toLowerCase() === "end"
    ) {
      //remove ship
      let query = `{
            getShip(guild_id: "${message.guild.id}", user_id: "${message.author.id}") {
              user_id ship_id timestamp
            }
          }`;
      try {
        let res = await request(url, query);
        if (res.getShip !== null) {
          query = `mutation{
            deleteShip(guild_id: "${message.guild.id}", user_id: "${message.author.id}") {
              guild_id
            }
          }`;
          try {
            await request(url, query);
            query = `mutation{
            deleteShip(guild_id: "${message.guild.id}", user_id: "${res.getShip.ship_id}") {
              guild_id
            }
          }`;
            try {
              await request(url, query);
              messageShipId.deleteMessageIds(message.author.id);
              message.channel
                .send(`${message.author} you are free ! have fun !!`)
                .catch(err => console.error(err));
              message.guild
                .fetchMember(res.getShip.ship_id)
                .then(m => {
                  m.send(
                    `${message.author.username} ended the ship with you ! i'm sorry !!`
                  ).catch(err => console.error(err));
                  m.send("<a:crying:661358360091688980>").catch(err =>
                    console.error(err)
                  );
                })
                .catch(err => console.error(err));
              return console.log(res);
            } catch (err) {
              console.error(err);
              message.channel
                .send("i broke something")
                .catch(err => console.error(err));
              return message.channel
                .send("<:deadinside:606350795881054216>")
                .catch(err => console.error(err));
            }
          } catch (err) {
            console.error(err);
            message.channel
              .send("i broke something")
              .catch(err => console.error(err));
            return message.channel
              .send("<:deadinside:606350795881054216>")
              .catch(err => console.error(err));
          }
        } else {
          message.channel
            .send(
              `${message.author} you are not even shipped with anyone weirdo !`
            )
            .catch(err => console.error(err));
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
  async function makeCanvasImage(avatarURL1, avatarURL2) {
    const canvas = Canvas.createCanvas(600, 338);

    const ctx = canvas.getContext("2d");

    let reqPath = path.join(__dirname, "../../images/ship.png");
    const background = await Canvas.loadImage(reqPath);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(146, 120, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.arc(437, 222, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const { body: buffer1 } = await snekfetch.get(avatarURL1);
    const avatar1 = await Canvas.loadImage(buffer1);
    await ctx.drawImage(avatar1, 46, 20, 200, 200);

    const { body: buffer2 } = await snekfetch.get(avatarURL2);
    const avatar2 = await Canvas.loadImage(buffer2);
    await ctx.drawImage(avatar2, 337, 122, 200, 200);

    return canvas.toBuffer();
  }
};
