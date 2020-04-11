const Discord = require("discord.js");
const config = require("./json/config.json");
const client = new Discord.Client();
const Enmap = require("enmap");
const fs = require("fs");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const mongoose = require("mongoose");

client.config = config;

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();

fs.readdir("./commands/admin/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/admin/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command admin - ${commandName}`);
    client.commands.set(commandName, props);
  });
});

fs.readdir("./commands/fun/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/fun/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command fun - ${commandName}`);
    client.commands.set(commandName, props);
  });
});

fs.readdir("./commands/info/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/info/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command info - ${commandName}`);
    client.commands.set(commandName, props);
  });
});

fs.readdir("./commands/imageManip/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/imageManip/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command imageManip - ${commandName}`);
    client.commands.set(commandName, props);
  });
});

fs.readdir("./commands/webscraper/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/webscraper/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command webscraper - ${commandName}`);
    client.commands.set(commandName, props);
  });
});

fs.readdir("./commands/me/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/me/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command me - ${commandName}`);
    client.commands.set(commandName, props);
  });
});

fs.readdir("./commands/automod/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/automod/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command automod - ${commandName}`);
    client.commands.set(commandName, props);
  });
});

// fs.readdir("./commands/music/", (err, files) => {
//   if (err) return console.error(err);
//   files.forEach(file => {
//     if (!file.endsWith(".js")) return;
//     let props = require(`./commands/music/${file}`);
//     let commandName = file.split(".")[0];
//     console.log(`Attempting to load command ${commandName}`);
//     client.commands.set(commandName, props);
//   });
// });

fs.readdir("./commands/levels/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/levels/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command levels - ${commandName}`);
    client.commands.set(commandName, props);
  });
});

mongoose
  .connect(`${process.env.MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log("database connected"))
  .catch(err => console.error(err));

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "../build")));

server.applyMiddleware({ app, path: "/api" });

app.listen({ port: process.env.PORT || 8080 }, () =>
  console.log(`Server ready at ${server.graphqlPath}`)
);

function startKeepAlive() {
  setInterval(function() {
    var options = {
      host: "",
      port: 80,
      path: "/"
    };
    http
      .get(options, function(res) {
        res.on("data", function(chunk) {
          try {
            // optional logging... disable after it's working
            //console.log("HEROKU RESPONSE: " + chunk);
          } catch (err) {
            console.log(err.message);
          }
        });
      })
      .on("error", function(err) {
        console.log("Error: " + err.message);
      });
  }, 10 * 60 * 1000); // load every 10 minutes
}

startKeepAlive();

client.login(process.env.TOKEN);
