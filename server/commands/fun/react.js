const randomNumber = require("../../data/randomNumber");
const randomColor = require("../../data/randomColor");
const Discord = require("discord.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const talkedRecently = new Set();

exports.run = async (client, message, args) => {
  if (
    message.channel.id === "561453542741901322" &&
    message.author.id !== "157673412561469440" &&
    message.author.id !== "630573404352937996"
  ) {
    message.channel
      .send("sorry but i'm not allowed in here anymore !")
      .catch(err => {
        console.error(err);
      });
    message.channel.send("<a:crying:661358360091688980>").catch(err => {
      console.error(err);
    });
  } else {
    if (
      talkedRecently.has("reaction-called") &&
      message.author.id !== "157673412561469440" &&
      message.author.id !== "630573404352937996"
    ) {
      message.channel.send("please not so fast please !!").catch(err => {
        console.error(err);
      });
      message.channel.send("<a:crying:661358360091688980>").catch(err => {
        console.error(err);
      });
    } else {
      let member = null;

      let query = "";
      args.shift();

      if (!message.mentions.members.first()) {
        // message.channel.send("You did not mention the user! ");
        // message.channel.send("<a:02upset:538273249306345476>");
        // return;
        for (let i = 0; i < args.length; i++) {
          query += `${args[i]} `;
        }
        grab_data();
      } else {
        member = await message.mentions.members.first();
        for (let i = 0; i < args.length; i++) {
          if (args[i].indexOf(`${member.user.id}`) === -1) {
            query += `${args[i]} `;
          }
        }
        grab_data();
      }

      function httpGetAsync(theUrl, callback) {
        // create the request object
        let xmlHttp = new XMLHttpRequest();

        // set the state change callback to capture when the response comes in
        xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
          }
        };

        // open as a GET call, pass in the url and set async = True
        xmlHttp.open("GET", theUrl, true);

        // call send with no params as they were passed in on the url string
        xmlHttp.send(null);

        return;
      }

      // callback for the top 8 GIFs of search
      function tenorCallback_search(responsetext) {
        // parse the json response
        let response_objects = JSON.parse(responsetext);

        top_15_gifs = response_objects["results"];
        if (top_15_gifs.length === 0) {
          message.channel
            .send(`There was no gifs for « ${query} !! »`)
            .catch(err => {
              console.error(err);
            });
        } else if (top_15_gifs.length >= 6) {
          let randNum = randomNumber(0, 6);
          if (top_15_gifs[randNum].media[0].gif.url !== undefined) {
            sendMessage(top_15_gifs[randNum].media[0].gif.url);
          } else {
            message.channel.send("Something went wrong !");
            message.channel.send("<:deadinside:606350795881054216>");
          }
        } else {
          let randNum = randomNumber(0, top_15_gifs.length - 1);
          if (top_15_gifs[randNum].media[0].gif.url !== undefined) {
            sendMessage(top_15_gifs[randNum].media[0].gif.url);
          } else {
            message.channel.send("Something went wrong !");
            message.channel.send("<:deadinside:606350795881054216>");
          }
        }

        return;
      }

      // function to call the trending and category endpoints
      function grab_data() {
        // set the apikey and limit
        let apikey = process.env.TENOR_KEY;
        let lmt = 7;

        // test search term
        let search_term = query;

        // using default locale of en_US
        let search_url =
          "https://api.tenor.com/v1/search?tag=" +
          search_term +
          "&key=" +
          apikey +
          "&limit=" +
          lmt;

        httpGetAsync(search_url, tenorCallback_search);

        // data will be loaded by each call's callback
        return;
      }

      function sendMessage(url) {
        let showQuery = "";
        let messageEmbed = new Discord.RichEmbed()
          .setColor(randomColor())
          .setImage(url)
          .setTimestamp()
          .setFooter(
            `${message.guild.name} | ${showQuery}`,
            "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
          )
          .setTimestamp();

        if (member !== null) {
          for (let i = 0; i < args.length; i++) {
            if (args[i].indexOf(`${member.user.id}`) === -1) {
              if (
                args[i].toLowerCase() !== "anime" &&
                args[i].toLowerCase() !== "movie"
              )
                showQuery += `${args[i]} `;
            }
          }
          messageEmbed.setTitle(
            `${message.author.username} to ${member.user.username}: ${showQuery}`
          );
        } else {
          for (let i = 0; i < args.length; i++) {
            if (
              args[i].toLowerCase() !== "anime" &&
              args[i].toLowerCase() !== "movie"
            )
              showQuery += `${args[i]} `;
          }
          messageEmbed.setTitle(
            `${message.author.username} reacted with: ${showQuery}`
          );
        }

        message.channel.send(messageEmbed).then(msg => {
          const filter = m =>
            m.content
              .toLowerCase()
              .replace(/([^a-z])/g)
              .indexOf("wrong") >= 0 ||
            m.content
              .toLowerCase()
              .replace(/([^a-z])/g)
              .indexOf("bad bot") >= 0 ||
            m.content
              .toLowerCase()
              .replace(/([^a-z])/g)
              .indexOf("what") >= 0 ||
            m.content
              .toLowerCase()
              .replace(/([^a-z])/g)
              .indexOf("not right") >= 0;
          message.channel
            .awaitMessages(filter, {
              max: 2,
              time: 20000,
              errors: ["time"]
            })
            .then(collected => {
              let foundNo = false;
              collected.map(msg => {
                let msgSplit = msg.toLowerCase().split(" ");
                for (let i = 0; i < msgSplit.length; i++) {
                  if (
                    msgSplit[i].replace(/([^a-z])/g).replace(/([o])/g, "") ===
                      "n" ||
                    msgSplit[i].replace(/([^a-z])/g).replace(/([o])/g, "") ===
                      "npe"
                  ) {
                    foundNo = true;
                  }
                }
              });
              if (foundNo) {
                message.channel
                  .send(`do you want to get banned ${message.author.tag} ??`)
                  .catch(err => {
                    console.error(err);
                  });
              }
            })
            .catch(err => console.error(err));
          talkedRecently.add("reaction-called");
          setTimeout(() => {
            talkedRecently.delete("reaction-called");
          }, 45000);
        });
      }
    }
  }
};
