const Discord = require("discord.js");
const Nightmare = require("nightmare");

exports.run = async (client, message, args) => {
  message.channel.startTyping();

  const nightmare = Nightmare({ width: 1080, height: 800 });

  await nightmare
    .goto(`https://yagpdb.xyz/public/${message.guild.id}/stats`)
    .wait("#chart-message-counts")
    .wait(1103)
    .evaluate(getBounds, "#chart-message-counts")
    .then(async rects => {
      console.log(rects);
      nightmare
        .scrollTo(rects.top + rects.height + 60 - 800, 0)
        .evaluate(getBounds, "#chart-message-counts")
        .then(async rects => {
          function getScreenshot(rect) {
            nightmare
              .screenshot({
                x: rect.left,
                y: 800 - 60 - rect.height + 4,
                width: rect.width,
                height: rect.height - 8
              })
              .end()
              .then(buffer => {
                const attachment = new Discord.Attachment(
                  buffer,
                  "channels_graph.jpg"
                );
                message.channel
                  .send(attachment)
                  .then(() => message.channel.stopTyping(true));
              })
              .catch(function(err) {
                console.error(err);
                message.channel.stopTyping(true);
              });
          }

          getScreenshot(rects);
        });
    })
    .catch(function(err) {
      console.error(err);
      message.channel.stopTyping(true);
    });

  function getBounds(selector) {
    let el = document
      .querySelector(selector)
      .parentElement.parentElement.parentElement.getBoundingClientRect();

    let obj = {
      top: el.top,
      left: el.left + 15,
      width: el.width - 30,
      height: el.height
    };
    return obj;
  }
};
