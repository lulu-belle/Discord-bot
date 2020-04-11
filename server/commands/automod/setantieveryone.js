const { request } = require("graphql-request");
const serverMain = require("../../data/serverMain");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (message.member.hasPermission("BAN_MEMBERS")) {
    let server = serverMain.get(message.guild.id);
    let url = "";

    if (server.everyone_warn === false) {
      message.channel.send(
        `will warn everyone that tries to do an @ everyone ping`
      );
    } else {
      message.channel.send("not watching @ everyone pings");
    }

    let query = `mutation{
                setEveryoneWarn(guild_id: "${
                  message.guild.id
                }", everyone_warn: ${!server.everyone_warn}){
                    guild_id
                }
            }`;
    try {
      await request(url, query);
      server.everyone_warn = !server.everyone_warn;
    } catch (err) {
      console.error(err);
    }
  }
};
