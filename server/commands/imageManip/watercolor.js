const Discord = require("discord.js");
const Canvas = require("canvas");
const snekfetch = require("snekfetch");
const Jimp = require("jimp");
const sizeOf = require("buffer-image-size");
const Promise = require("bluebird");

exports.run = async (client, message, args) => {
  message.channel.startTyping();

  if (message.attachments.first()) {
    jimpOrSnek(
      message.attachments.first().url,
      message.attachments.first().width,
      message.attachments.first().height
    );
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
              jimpOrSnek(
                m.attachments.first().url,
                m.attachments.first().width,
                m.attachments.first().height
              );
            } else {
              return message.channel
                .send("there is no photo with this message silly !")
                .then(() => message.channel.stopTyping(true))
                .catch((err) => console.error(err));
            }
          })
          .catch(() => {
            return message.channel
              .send("sorry but i cannot find this message in this channel !")
              .then(() => message.channel.stopTyping(true))
              .catch((err) => console.error(err));
          });
    } else {
      let foundPhoto = false;
      message.channel
        .fetchMessages({
          limit: 3
        })
        .then(async messages => {
          await Promise.all(
            messages.map(async m => {
              if (m.attachments.first() && !foundPhoto) {
                jimpOrSnek(
                  m.attachments.first().url,
                  m.attachments.first().width,
                  m.attachments.first().height
                );
                foundPhoto = true;
              }
            })
          );
          if (!foundPhoto) {
            return message.channel
              .send(
                "sorry but i cannot find any photos before the command ! just a heads up i only look in 2 messages above yours ! you can always give me the message id and use me like **.watercolour 679873905745199146** !!"
              )
              .then(() => message.channel.stopTyping(true))
              .catch((err) => console.error(err));
          }
        });
    }
  }
  async function makeCanvas(buffer, width, height) {
    const canvas = Canvas.createCanvas(width, height);

    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage(buffer);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    await oilPaintEffect(canvas, ctx, 2, 60);
    // await oilPaintEffect(canvas, ctx, 15, 100);

    let img = canvas.toBuffer();
    const attachment = new Discord.Attachment(img, "watercolour.png");
    message.channel
      .send(attachment)
      .then(() => message.channel.stopTyping(true))
      .catch((err) => console.error(err));
  }

  function oilPaintEffect(canvas, ctx, radius, intensity) {
    var width = canvas.width,
      height = canvas.height,
      imgData = ctx.getImageData(0, 0, width, height),
      pixData = imgData.data,
      destCanvas = Canvas.createCanvas(canvas.width, canvas.height),
      dCtx = destCanvas.getContext("2d"),
      pixelIntensityCount = [];

    destCanvas.width = width;
    destCanvas.height = height;

    var destImageData = dCtx.createImageData(width, height),
      destPixData = destImageData.data,
      intensityLUT = [],
      rgbLUT = [];

    for (var y = 0; y < height; y++) {
      intensityLUT[y] = [];
      rgbLUT[y] = [];
      for (var x = 0; x < width; x++) {
        var idx = (y * width + x) * 4,
          r = pixData[idx],
          g = pixData[idx + 1],
          b = pixData[idx + 2],
          avg = (r + g + b) / 3;

        intensityLUT[y][x] = Math.round((avg * intensity) / 255);
        rgbLUT[y][x] = {
          r: r,
          g: g,
          b: b
        };
      }
    }

    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        pixelIntensityCount = [];

        // Find intensities of nearest pixels within radius.
        for (var yy = -radius; yy <= radius; yy++) {
          for (var xx = -radius; xx <= radius; xx++) {
            if (y + yy > 0 && y + yy < height && x + xx > 0 && x + xx < width) {
              var intensityVal = intensityLUT[y + yy][x + xx];

              if (!pixelIntensityCount[intensityVal]) {
                pixelIntensityCount[intensityVal] = {
                  val: 1,
                  r: rgbLUT[y + yy][x + xx].r,
                  g: rgbLUT[y + yy][x + xx].g,
                  b: rgbLUT[y + yy][x + xx].b
                };
              } else {
                pixelIntensityCount[intensityVal].val++;
                pixelIntensityCount[intensityVal].r += rgbLUT[y + yy][x + xx].r;
                pixelIntensityCount[intensityVal].g += rgbLUT[y + yy][x + xx].g;
                pixelIntensityCount[intensityVal].b += rgbLUT[y + yy][x + xx].b;
              }
            }
          }
        }

        pixelIntensityCount.sort(function(a, b) {
          return b.val - a.val;
        });

        var curMax = pixelIntensityCount[0].val,
          dIdx = (y * width + x) * 4;

        destPixData[dIdx] = ~~(pixelIntensityCount[0].r / curMax);
        destPixData[dIdx + 1] = ~~(pixelIntensityCount[0].g / curMax);
        destPixData[dIdx + 2] = ~~(pixelIntensityCount[0].b / curMax);
        destPixData[dIdx + 3] = 255;
      }
    }

    ctx.putImageData(destImageData, 0, 0);
  }

  function jimpImg(bufferURL, width, height) {
    message.channel.send(
      "this is a big image so give me a seconde please !! <:softheart:575053165804912652>"
    );
    return new Promise((resolve, reject) => {
      Jimp.read({
        url: bufferURL
      })
        // Jimp.read(buffer)
        .then(async image => {
          if (width >= height)
            image.resize(600, Jimp.AUTO, Jimp.RESIZE_HERMITE);
          else image.resize(Jimp.AUTO, 600, Jimp.RESIZE_HERMITE);
          let bufferImg = await image.getBufferAsync(Jimp.AUTO);
          let dimensions = sizeOf(bufferImg);
          let obj = {
            buffer: bufferImg,
            width: dimensions.width,
            height: dimensions.height
          };
          return resolve(obj);

          // return startCanvas(bufferImg, dimensions.width, dimensions.height);
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

  function snekImg(bufferURL) {
    return new Promise(async (resolve, reject) => {
      let { body: buffer } = await snekfetch.get(bufferURL);
      return resolve(buffer);
      // return startCanvas(buffer, width, height);
    });
  }

  function jimpOrSnek(bufferURL, width, height) {
    if (width > 600 || height > 600)
      jimpImg(bufferURL, width, height)
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
    else
      snekImg(bufferURL)
        .timeout(10000)
        .then(buffer => {
          makeCanvas(buffer, width, height);
        })
        .catch(Promise.TimeoutError, e => {
          console.log("promise took longer than 10 seconds", e);
          return message.channel
            .send("sorry but i struggled trying to get the photo !!")
            .then(() => message.channel.stopTyping(true));
        });
  }
};
