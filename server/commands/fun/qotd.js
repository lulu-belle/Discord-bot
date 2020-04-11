const axios = require("axios");
const randomNumber = require("../../data/randomNumber");

exports.run = (client, message) => {
  // if (message.guild.id === "559560674246787087") {
  axios({
    url: "https://wrapapi.com/use/lulu/daily-question/question/0.0.1",
    method: "post",
    data: {
      wrapAPIKey: "rVHN7FqwMNgpXbRTHIowAIbsxan8Uxpa"
    }
  })
    .then(res => {
      let question = res.data.data.output[randomNumber(0, 200)];
      message.channel.send(question).catch(err => {
        console.error(err);
      });
      message.channel.setTopic(question).catch(() =>
        message.channel
          .send(
            "I failed at changing the topic of the channel... i'm sorry </3"
          )
          .catch(err => {
            console.error(err);
          })
      );
    })
    .catch(err => {
      console.error(err);
    });

  setTimeout(() => {
    message
      .delete()
      .catch(() =>
        message.channel.send(
          "I dont have the permission to delete the command message!"
        )
      );
  }, 200);
  // }
};
