const Discord = require("discord.js");
const Canvas = require("canvas");
const Jimp = require("jimp");
const sizeOf = require("buffer-image-size");
const Promise = require("bluebird");

exports.run = async (client, message, args) => {
  message.channel.startTyping();

  if (message.attachments.first()) {
    let pixelSize = 3;
    if (args[1]) pixelSize = Number(args[1]) > 6 ? 6 : Number(args[1]);
    if (args[1]) pixelSize = Number(args[1]) < 1 ? 1 : Number(args[1]);
    pixelImg(
      message.attachments.first().url,
      message.attachments.first().width,
      message.attachments.first().height,
      pixelSize
    )
      .timeout(100000000)
      .then(obj => {
        startCanvas(obj.buffer, obj.width, obj.height);
      })
      .catch(Promise.TimeoutError, e => {
        console.log("promise took longer than 10 seconds", e);
        return message.channel
          .send("sorry but i struggled trying to get the photo !!")
          .then(() => message.channel.stopTyping(true));
      });
  } else {
    if (
      args[1] &&
      (args[1].replace(/([^0-9])/g, "").length === 17 ||
        args[1].replace(/([^0-9])/g, "").length === 18 ||
        args[1].replace(/([^0-9])/g, "").length === 19)
    ) {
      message.channel
        .fetchMessage(args[1].replace(/([^0-9])/g, ""))
        .then(async m => {
          if (m.attachments.first()) {
            let pixelSize = 3;
            if (args[2]) pixelSize = Number(args[2]) > 6 ? 6 : Number(args[2]);
            if (args[2]) pixelSize = Number(args[2]) < 1 ? 1 : Number(args[2]);
            pixelImg(
              m.attachments.first().url,
              m.attachments.first().width,
              m.attachments.first().height,
              pixelSize
            )
              .timeout(100000000)
              .then(obj => {
                startCanvas(obj.buffer, obj.width, obj.height);
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
        .catch(() => {
          return message.channel
            .send("sorry but i cannot find this message in this channel !")
            .then(() => message.channel.stopTyping(true));
        });
    } else {
      let foundPhoto = false;
      message.channel.fetchMessages({ limit: 3 }).then(async messages => {
        await Promise.all(
          messages.map(async m => {
            if (m.attachments.first() && !foundPhoto) {
              foundPhoto = true;
              let pixelSize = 3;
              if (args[1])
                pixelSize = Number(args[1]) > 6 ? 6 : Number(args[1]);
              if (args[1])
                pixelSize = Number(args[1]) < 1 ? 1 : Number(args[1]);
              pixelImg(
                m.attachments.first().url,
                m.attachments.first().width,
                m.attachments.first().height,
                pixelSize
              )
                .timeout(10000)
                .then(obj => {
                  startCanvas(obj.buffer, obj.width, obj.height);
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
              "sorry but i cannot find any photos before the command ! just a heads up i only look in 2 messages above yours ! you can always give me the message id and use me like **.pixelate 679873905745199146** !!"
            )
            .then(() => message.channel.stopTyping(true))
            .catch((err) => console.error(err));
        }
      });
    }
  }
  async function startCanvas(buffer, width, height) {
    const canvas = Canvas.createCanvas(width, height);

    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage(buffer);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    let img = canvas.toBuffer();
    const attachment = new Discord.Attachment(img, "pixelate.png");
    return message.channel
      .send(attachment)
      .then(() => message.channel.stopTyping(true))
      .catch((err) => console.error(err));
  }

  function pixelImg(bufferURL, width, height, pixelSize) {
    return new Promise((resolve, reject) => {
      Jimp.read({
        url: bufferURL
      })
        // Jimp.read(buffer)
        .then(async image => {
          message.channel.send(
            "this is a big image so give me a seconde please !! <:softheart:575053165804912652>"
          ).catch((err) => console.error(err));
          if (width > 600 || height > 600) {
            if (width >= height)
              image.resize(600, Jimp.AUTO, Jimp.RESIZE_HERMITE);
            else image.resize(Jimp.AUTO, 600, Jimp.RESIZE_HERMITE);
          }
          image.pixelate(pixelSize);
          let bufferImg = await image.getBufferAsync(Jimp.AUTO);
          let dimensions = sizeOf(bufferImg);
          // return startCanvas(bufferImg, dimensions.width, dimensions.height);
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
            .then(() => message.channel.stopTyping(true))
            .catch((err) => console.error(err));
          return console.error(err);
        });
    });
  }
};
