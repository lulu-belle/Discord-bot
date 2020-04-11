const Discord = require("discord.js");
const Canvas = require("canvas");
const path = require("path");

exports.run = async (client, message, args) => {
  if (message.author.id == "157673412561469440") {
    const canvas = Canvas.createCanvas(900, 856);

    const ctx = canvas.getContext("2d");

    let txt = message.author.username.replace(/[^\w\s]/gi, "").toUpperCase();

    let ttfPath = path.join(__dirname, "../../fonts/Bubblegum.ttf");

    Canvas.registerFont(ttfPath, { family: "bubbles" });
    ctx.textAlign = "center";

    ctx.font = "36px bubbles";
    ctx.fillStyle = "#ffa1d5";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000000";

    let txtWidth = ctx.measureText(txt).width;

    let reqPath = path.join(__dirname, "../../images/my-heart.png");
    const background = await Canvas.loadImage(reqPath);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeText(`${txt}`, 685, 336);

    ctx.fillText(`${txt}`, 685, 336);

    let img = canvas.toBuffer();
    const attachment = new Discord.Attachment(img, "valentines.png");
    message.channel.send(attachment);
  }
};
