const Nightmare = require("nightmare");

exports.run = async (client, message, args) => {
  message.channel.startTyping();

  const nightmare = Nightmare();

  await nightmare
    .goto("")
    .wait("svg")
    .evaluate(getBounds, "svg")
    .then(function(rects) {
      console.log(rects);

      function getScreenshot(rects, index) {
        if (index == rects.length) return;
        nightmare
          .wait(`.server-${message.guild.id}`)
          .click(`.server-${message.guild.id}`)
          .wait("svg")
          .wait(1000) //add timer for graph to update
          .scrollTo(rects[index].y, 0)
          .screenshot({
            //109 is height of the top element which remains
            x: rects[index].x - 10,
            y: 109,
            width: rects[index].width + 30,
            height: rects[index].height + 40
          })
          .end()
          .then(buffer => {
            message.channel
              .send({
                files: [buffer]
              })
              .then(() => message.channel.stopTyping(true));
          })
          .catch(function(err) {
            console.error(err);
            message.channel.stopTyping(true);
          });
      }

      getScreenshot(rects, 0);
    })
    .catch(function(err) {
      console.error(err);
      message.channel.stopTyping(true);
    });

  function getBounds(selector) {
    var elements = document.querySelectorAll(selector);
    if (elements && elements.length > 0) {
      var arr = [];
      const r = Math.round;
      for (var ii = 0; ii < elements.length; ii++) {
        var rect = elements[ii].getBoundingClientRect();
        arr.push({
          x: r(rect.left),
          y: r(rect.top),
          width: r(rect.width),
          height: r(rect.height)
        });
      }
      return arr;
    }
    return null;
  }
};
