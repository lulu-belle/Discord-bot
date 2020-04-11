const Nightmare = require("nightmare");
const Discord = require("discord.js");
const randomColor = require("../../data/randomColor");
const randomNum = require("../../data/randomNumber");
const talkedRecently = new Set();

exports.run = async (client, message, args) => {
  if (
    message.author.id !== "157673412561469440" &&
    message.author.id !== "630573404352937996"
  ) {
    message.channel.send("sorry but you are not allowed to use this !");
    message.channel.send("<:natsukiJoy:646210607166652430>");
  } else {
    message.channel.startTyping();

    const nightmare = Nightmare({
      show: false
    });

    let query = message.content.replace(".imagensfw", "").trim();
    query = query.replace(/[\s]/g, "%20");
    await nightmare
      .goto(`https://www.qwant.com/?q=${query}&t=images&s=0`)
      .wait(".results-column")
      .wait(500)
      .evaluate(async () => {
        return await Array.from(
          document.querySelectorAll(".result__thumb-container__image"),
          element =>
            (element = {
              src: element.src,
              original_source: element.dataset.original,
              resolution: `Résolution: ${element.dataset.naturalwidth} x ${element.dataset.naturalheight}`
            })
        );
      })
      .end()
      .then(imgs => {
        let format = link => {
          let str = "Format: ";
          if (link.toLowerCase().indexOf(".jpg") >= 0) {
            return str + "JPG";
          } else if (link.toLowerCase().indexOf(".jpeg") >= 0) {
            return str + "JPEG";
          } else if (link.toLowerCase().indexOf(".bmp") >= 0) {
            return str + "BMP";
          } else if (link.toLowerCase().indexOf(".gif") >= 0) {
            return str + "GIF";
          } else if (link.toLowerCase().indexOf(".png") >= 0) {
            return str + "PNG";
          } else if (link.toLowerCase().indexOf(".tiff") >= 0) {
            return str + "TIFF";
          } else if (link.toLowerCase().indexOf(".svg") >= 0) {
            return str + "SVG";
          } else {
            return str + "???";
          }
        };

        if (imgs.length === 0) {
          message.channel.send(
            `sorry but i looked everywhere and could not find anything for **${message.content
              .replace(".imagensfw", "")
              .trim()}**`
          );
          message.channel
            .send("<:confusedKanna:665372884402962432>")
            .then(() => message.channel.stopTyping(true));
        } else {
          let img =
            imgs.length > 10
              ? imgs[randomNum(0, 9)]
              : imgs[randomNum(0, imgs.length - 1)];
          let embed = new Discord.RichEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL)
            .setColor(randomColor())
            .setDescription(
              `Résultat pour la recherche: **[${message.content
                .replace(".imagensfw", "")
                .trim()}](${img.original_source})**`
            )
            .setImage(img.src)
            .setFooter(`${img.resolution} | ${format(img.original_source)}`)
            .setTimestamp();
          message.channel
            .send(embed)
            .then(() => message.channel.stopTyping(true));
        }
      })
      .catch(function(err) {
        console.error(err);
        message.channel.send("i broke something");
        message.channel
          .send("<:deadinside:606350795881054216>")
          .then(() => message.channel.stopTyping(true));
      });
  }
};
