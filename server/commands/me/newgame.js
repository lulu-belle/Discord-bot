const Discord = require("discord.js");
const Canvas = require("canvas");
const path = require("path");

exports.run = async (client, message, args) => {
  if (message.author.id == "157673412561469440") {
    const canvas = Canvas.createCanvas(640, 784);

    const ctx = canvas.getContext("2d");

    let txt = message.author.username.replace(/[^\w\s]/gi, "").toUpperCase();

    let ttfPath = path.join(__dirname, "../../fonts/PressStart.ttf");

    Canvas.registerFont(ttfPath, { family: "vga" });

    ctx.textAlign = "left";

    ctx.font = "25px vga";

    let txtWidth = ctx.measureText(txt).width;
    console.log(txtWidth);

    let reqPath = path.join(__dirname, "../../images/new-game.png");
    const background = await Canvas.loadImage(reqPath);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.scale(1, 1.25);

    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 4;

    ctx.fillText(`${txt}`, 103, 64);
    ctx.strokeText(`${txt}`, 103, 64);

    ctx.fillStyle = "#ff2953";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;

    ctx.strokeText(`${txt}`, 100, 61);

    ctx.fillText(`${txt}`, 100, 61);

    ctx.restore();

    let img = canvas.toBuffer();
    const attachment = new Discord.Attachment(img, "valentines.png");
    message.channel.send(attachment);
  }
};
