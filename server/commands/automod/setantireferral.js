const { request } = require("graphql-request");
const serverMain = require("../../data/serverMain");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (message.member.hasPermission("BAN_MEMBERS")) {
    let server = serverMain.get(message.guild.id);
    let url = "";

    if (server.anti_referral === false) {
      message.channel.send(
        `will warn everyone that tries to post a referral link`
      );
    } else {
      message.channel.send("not watching referral links");
    }

    let query = `mutation{
                setAntiReferral(guild_id: "${
                  message.guild.id
                }", anti_referral: ${!server.anti_referral}){
                    guild_id
                }
            }`;
    try {
      await request(url, query);
      server.anti_referral = !server.anti_referral;
    } catch (err) {
      console.error(err);
    }
  }
};
