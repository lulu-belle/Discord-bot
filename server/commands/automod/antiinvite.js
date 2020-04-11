const { request } = require("graphql-request");
const serverMain = require("../../data/serverMain");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (message.member.hasPermission("BAN_MEMBERS")) {
    let server = serverMain.get(message.guild.id);
    let url = "";

    if (server.anti_invite === false) {
      message.channel.send(
        `will warn everyone that tries to post an invite link`
      );
    } else {
      message.channel.send("not watching invite links");
    }

    let query = `mutation{
                setAntiInvite(guild_id: "${
                  message.guild.id
                }", anti_invite: ${!server.anti_invite}){
                    guild_id
                }
            }`;
    try {
      await request(url, query);
      server.anti_invite = !server.anti_invite;
    } catch (err) {
      console.error(err);
    }
  }
};
