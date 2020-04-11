const Discord = require("discord.js");
const Canvas = require("canvas");
const path = require("path");
const randomNum = require("../../data/randomNumber");

exports.run = async (client, message) => {
  //   const wait = require("util").promisify(setTimeout);
  // if (message.author.id === "157673412561469440") {
  //   let img = null,
  //     attachment = null;
  //   let memArray = [];
  //   await Promise.all(
  //     message.guild.members.map(async mem => {
  //       if (
  //         !mem.user.bot &&
  //         !mem._roles.includes("561302712470208513") &&
  //         !mem._roles.includes("615421712632119303")
  //       ) {
  //         memArray.push(mem);
  //       }
  //     })
  //   );
  //   for (let i in memArray) {
  //     setTimeout(async () => {
  //       img = await randFunction(memArray[i].user.username);
  //       attachment = new Discord.Attachment(
  //         img,
  //         `valentines-${memArray[i].user.username.replace(
  //           /[^a-zA-z]/g,
  //           ""
  //         )}.png`
  //       );
  //       if (
  //         memArray[i].user.username.replace(/[^\w\s]/gi, "") ===
  //         memArray[i].user.username
  //       ) {
  //         await memArray[i]
  //           .send(
  //             "hey ! i made something for you ! I hope you like it ! <:softheart:575053165804912652>",
  //             attachment
  //           )
  //           .then(m => console.log(memArray[i].user.username))
  //           .catch(err => console.error(err));
  //       } else {
  //         await memArray[i]
  //           .send(
  //             "hey ! i made something for you ! I hope you like it !\ni tried to get your name right ! it is hard to read all the letters !! <:softheart:575053165804912652>",
  //             attachment
  //           )
  //           .then(m => console.log(memArray[i].user.username))
  //           .catch(err => console.error(err));
  //       }
  //     }, i * 1250);
  //   }
  // }
  // async function randFunction(username) {
  //   let functArray = [newGame, newGame, cake, myHeart];
  //   return await functArray[randomNum(0, functArray.length - 1)](username);
  // }
  // async function newGame(username) {
  //   const canvas = Canvas.createCanvas(640, 784);
  //   const ctx = canvas.getContext("2d");
  //   let txt = username.replace(/[^\w\s]/gi, "").toUpperCase();
  //   let ttfPath = path.join(__dirname, "../../fonts/PressStart.ttf");
  //   Canvas.registerFont(ttfPath, { family: "vga" });
  //   ctx.textAlign = "left";
  //   ctx.font = "25px vga";
  //   let txtWidth = ctx.measureText(txt).width;
  //   console.log(txtWidth);
  //   let reqPath = path.join(__dirname, "../../images/new-game.png");
  //   const background = await Canvas.loadImage(reqPath);
  //   ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  //   ctx.scale(1, 1.25);
  //   ctx.fillStyle = "#000000";
  //   ctx.strokeStyle = "#000000";
  //   ctx.lineWidth = 4;
  //   ctx.fillText(`${txt}`, 103, 64);
  //   ctx.strokeText(`${txt}`, 103, 64);
  //   ctx.fillStyle = "#ff2953";
  //   ctx.strokeStyle = "#ffffff";
  //   ctx.lineWidth = 5;
  //   ctx.strokeText(`${txt}`, 100, 61);
  //   ctx.fillText(`${txt}`, 100, 61);
  //   ctx.restore();
  //   return canvas.toBuffer();
  // }
  // async function cake(username) {
  //   const canvas = Canvas.createCanvas(1000, 1138);
  //   const ctx = canvas.getContext("2d");
  //   let txt = username.replace(/[^\w\s]/gi, "");
  //   let ttfPath = path.join(__dirname, "../../fonts/Inkfree.ttf");
  //   Canvas.registerFont(ttfPath, { family: "ink" });
  //   ctx.textAlign = "center";
  //   ctx.font = "55px ink";
  //   ctx.fillStyle = "#ff7b7b";
  //   ctx.lineWidth = 3;
  //   ctx.strokeStyle = "#000000";
  //   ctx.shadowOffsetX = 4;
  //   ctx.shadowOffsetY = 4;
  //   ctx.shadowColor = "rgba(0,0,0,0.2)";
  //   ctx.shadowBlur = 4;
  //   let txtWidth = ctx.measureText(txt).width;
  //   console.log(txtWidth);
  //   let reqPath = path.join(__dirname, "../../images/cake.png");
  //   const background = await Canvas.loadImage(reqPath);
  //   ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  //   ctx.rotate(6 * (Math.PI / 180));
  //   ctx.strokeText(`${txt}`, 747, 571);
  //   ctx.strokeText(`${txt}`, 749, 571);
  //   ctx.strokeText(`${txt}`, 745, 571);
  //   ctx.strokeText(`${txt}`, 747, 573);
  //   ctx.strokeText(`${txt}`, 747, 569);
  //   ctx.fillText(`${txt}`, 747, 571);
  //   ctx.fillText(`${txt}`, 745, 571);
  //   ctx.fillText(`${txt}`, 746, 571);
  //   ctx.fillText(`${txt}`, 747, 569);
  //   ctx.fillText(`${txt}`, 747, 570);
  //   ctx.fillText(`${txt}`, 748, 571);
  //   ctx.fillText(`${txt}`, 749, 571);
  //   ctx.fillText(`${txt}`, 747, 572);
  //   ctx.fillText(`${txt}`, 747, 573);
  //   ctx.rotate(-6 * (Math.PI / 180));
  //   return canvas.toBuffer();
  // }
  // async function myHeart(username) {
  //   const canvas = Canvas.createCanvas(900, 856);
  //   const ctx = canvas.getContext("2d");
  //   let txt = username.replace(/[^\w\s]/gi, "").toUpperCase();
  //   let ttfPath = path.join(__dirname, "../../fonts/Bubblegum.ttf");
  //   Canvas.registerFont(ttfPath, { family: "bubbles" });
  //   ctx.textAlign = "center";
  //   ctx.font = "36px bubbles";
  //   ctx.fillStyle = "#ffa1d5";
  //   ctx.lineWidth = 3;
  //   ctx.strokeStyle = "#000000";
  //   let txtWidth = ctx.measureText(txt).width;
  //   console.log(txtWidth);
  //   let reqPath = path.join(__dirname, "../../images/my-heart.png");
  //   const background = await Canvas.loadImage(reqPath);
  //   ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  //   ctx.strokeText(`${txt}`, 685, 336);
  //   ctx.fillText(`${txt}`, 685, 336);
  //   return canvas.toBuffer();
  // }
};
