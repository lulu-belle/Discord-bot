const Discord = require("discord.js");
const Canvas = require("canvas");
const Promise = require("bluebird");
const Jimp = require("jimp");
const sizeOf = require("buffer-image-size");
const CanvasTextWrapper = require("canvas-text-wrapper").CanvasTextWrapper;

exports.run = async (client, message, args) => {
  message.channel.startTyping();

  if (message.attachments.first()) {
    resize(
      message.attachments.first().url,
      message.attachments.first().width,
      message.attachments.first().height
    )
      .timeout(10000)
      .then(obj => {
        makeCanvas(obj.buffer, obj.width, obj.height);
      })
      .catch(Promise.TimeoutError, e => {
        console.log("promise took longer than 10 seconds", e);
        return message.channel
          .send("sorry but i struggled trying to get the photo !!")
          .then(() => message.channel.stopTyping(true));
      });
  } else {
    if (args[1]) {
      if (
        args[1].replace(/([^0-9])/g, "").length === 17 ||
        args[1].replace(/([^0-9])/g, "").length === 18 ||
        args[1].replace(/([^0-9])/g, "").length === 19
      )
        message.channel
          .fetchMessage(args[1].replace(/([^0-9])/g, ""))
          .then(async m => {
            if (m.attachments.first()) {
              resize(
                m.attachments.first().url,
                m.attachments.first().width,
                m.attachments.first().height
              )
                .timeout(10000)
                .then(obj => {
                  makeCanvas(obj.buffer, obj.width, obj.height);
                })
                .catch(Promise.TimeoutError, e => {
                  console.log("promise took longer than 10 seconds", e);
                  return message.channel
                    .send("sorry but i struggled trying to get the photo !!")
                    .then(() => message.channel.stopTyping(true));
                });
            } else {
              return message.channel
                .send("there is no photo with this message silly !")
                .then(() => message.channel.stopTyping(true));
            }
          })
          .catch(() =>
            message.channel
              .send("sorry but i cannot find this message in this channel !")
              .then(() => message.channel.stopTyping(true))
          );
      else
        return message.channel.send(
          "sorry but you are supposed to be giving me a message id for the argument !"
        );
    } else {
      let foundPhoto = false;
      message.channel.fetchMessages({ limit: 3 }).then(async messages => {
        await Promise.all(
          messages.map(async m => {
            if (m.attachments.first() && !foundPhoto) {
              resize(
                m.attachments.first().url,
                m.attachments.first().width,
                m.attachments.first().height
              )
                .timeout(10000)
                .then(obj => {
                  foundPhoto = true;
                  makeCanvas(obj.buffer, obj.width, obj.height);
                })
                .catch(Promise.TimeoutError, e => {
                  console.log("promise took longer than 10 seconds", e);
                  return message.channel
                    .send("sorry but i struggled trying to get the photo !!")
                    .then(() => message.channel.stopTyping(true));
                });
            }
          })
        );
        if (!foundPhoto) {
          return message.channel
            .send(
              "sorry but i cannot find any photos before the command ! just a heads up i only look in 2 messages above yours ! you can always give me the message id and use me like **.watercolour 679873905745199146** !!"
            )
            .then(() => message.channel.stopTyping(true));
        }
      });
    }
  }

  async function makeCanvas(buffer, width, height) {
    const canvas = Canvas.createCanvas(width, height);

    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage(buffer);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;

    if (width < 400 && height < 400) ctx.lineWidth = 1;

    ctx.strokeStyle = "#ffffff";

    let topCaption = "",
      bottomCaption = "";

    topCaption = await getCaptions(
      "what do you want the top caption to say ?? you can say **none** if you do not want a top caption !"
    );
    bottomCaption = await getCaptions(
      "okay and then what do you want the bottom caption to say ?? you can say **none** if you do not want a bottom caption !"
    );

    if (topCaption.length > 0) {
      await CanvasTextWrapper(canvas, topCaption, getStyle("top"));
    }
    if (bottomCaption.length > 0) {
      await CanvasTextWrapper(canvas, bottomCaption, getStyle("bottom"));
    }

    if (topCaption.length > 0 || bottomCaption.length > 0) {
      let img = canvas.toBuffer();
      const attachment = new Discord.Attachment(img, "meme.png");
      message.channel
        .send(attachment)
        .then(() => message.channel.stopTyping(true))
        .catch((err) => console.error(err));
    } else {
      return message.channel
        .send("you did not give me anything to caption the image with !!")
        .then(() => message.channel.stopTyping(true))
        .catch((err) => console.error(err));
    }
  }

  function resize(bufferURL, width, height) {
    return new Promise((resolve, reject) => {
      Jimp.read({
        url: bufferURL
      })

        // Jimp.read(buffer)
        .then(async image => {
          if (width > 600 || height > 600) {
            message.channel.send(
              "this is a big image so give me a seconde please !! <:softheart:575053165804912652>"
            ).catch((err) => console.error(err));
            if (width >= height)
              image.resize(600, Jimp.AUTO, Jimp.RESIZE_HERMITE);
            else image.resize(Jimp.AUTO, 600, Jimp.RESIZE_HERMITE);
          }
          let bufferImg = await image.getBufferAsync(Jimp.AUTO);
          let dimensions = await sizeOf(bufferImg);
          let obj = {
            buffer: bufferImg,
            width: dimensions.width,
            height: dimensions.height
          };
          return resolve(obj);
        })
        .catch(err => {
          message.channel
            .send("help i broke something !")
            .then(() => message.channel.stopTyping(true)).catch((err) => console.error(err));
          return console.error(err);
        });
    });
  }

  async function getCaptions(messageSend) {
    let m = await message.channel.send(messageSend);
    try {
      let collected = await message.channel.awaitMessages(
        res => res.author.id === message.author.id,
        {
          max: 1,
          time: 120000,
          errors: ["time"]
        }
      );
      let str = collected.first().content.trim();
      str = str.toLowerCase() === "none" ? "" : str;
      return str;
    } catch (err) {
      message.channel.send("sorry but i timed out !").catch((err) => console.error(err));
      console.error(err);
    }
  }

  function getStyle(verticalAlign) {
    return {
      font: "bold 36px Impact",
      textAlign: "center",
      verticalAlign: verticalAlign,
      paddingY: 15,
      paddingX: 20,
      strokeText: true,
      sizeToFill: true,
      maxFontSizeToFill: 36
    };
  }
};
