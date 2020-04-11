const Discord = require("discord.js");
const Canvas = require("canvas");
const path = require("path");

exports.run = async (client, message, args) => {
  if (message.author.id == "157673412561469440") {
    const canvas = Canvas.createCanvas(1000, 1138);

    const ctx = canvas.getContext("2d");

    let txt = message.author.username.replace(/[^\w\s]/gi, "");

    let ttfPath = path.join(__dirname, "../../fonts/Inkfree.ttf");

    Canvas.registerFont(ttfPath, { family: "ink" });
    ctx.textAlign = "center";

    ctx.font = "55px ink";
    ctx.fillStyle = "#ff7b7b";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000000";
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 4;

    let txtWidth = ctx.measureText(txt).width;

    let reqPath = path.join(__dirname, "../../images/cake.png");
    const background = await Canvas.loadImage(reqPath);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.rotate(6 * (Math.PI / 180));

    // ctx.strokeText(`${txt}`, 697, 631);
    // ctx.strokeText(`${txt}`, 699, 631);
    // ctx.strokeText(`${txt}`, 695, 631);
    // ctx.strokeText(`${txt}`, 697, 629);
    // ctx.strokeText(`${txt}`, 697, 633);

    // ctx.fillText(`${txt}`, 697, 631);
    // ctx.fillText(`${txt}`, 699, 631);
    // ctx.fillText(`${txt}`, 695, 631);
    // ctx.fillText(`${txt}`, 697, 629);
    // ctx.fillText(`${txt}`, 697, 633);

    ctx.strokeText(`${txt}`, 747, 571);

    ctx.strokeText(`${txt}`, 749, 571);
    ctx.strokeText(`${txt}`, 745, 571);
    ctx.strokeText(`${txt}`, 747, 573);
    ctx.strokeText(`${txt}`, 747, 569);

    ctx.fillText(`${txt}`, 747, 571);

    ctx.fillText(`${txt}`, 745, 571);
    ctx.fillText(`${txt}`, 746, 571);
    ctx.fillText(`${txt}`, 747, 569);
    ctx.fillText(`${txt}`, 747, 570);
    ctx.fillText(`${txt}`, 748, 571);
    ctx.fillText(`${txt}`, 749, 571);
    ctx.fillText(`${txt}`, 747, 572);
    ctx.fillText(`${txt}`, 747, 573);

    ctx.rotate(-6 * (Math.PI / 180));

    let img = canvas.toBuffer();
    const attachment = new Discord.Attachment(img, "valentines.png");
    message.channel.send(attachment);
  }
};
