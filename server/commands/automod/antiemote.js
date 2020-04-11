const { request } = require("graphql-request");
const serverMain = require("../../data/serverMain");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (message.member.hasPermission("BAN_MEMBERS")) {
    let server = serverMain.get(message.guild.id);
    let url = "";

    if (args[1]) {
      if (server.emote_limit) {
        let num = Number(args[1]);
        if (num && num >= 0 && num < 10) {
          let check = await setLimit(num);
          if (check)
            return message.channel.send(
              `messages will now be limited to ${num} emotes !`
            );
          else return message.channel.send("sorry i broke something !!");
        } else {
          return message.channel.send(
            `you need to give me a number from 0 to 9 not ${args[1]} !`
          );
        }
      } else {
        return message.channel.send(
          "you need to activate this module with **.emotelimit**"
        );
      }
    } else {
      if (server.emote_limit === false) {
        message.channel.send(
          `emote limiting is now active ! messages are limited to ${server.emote_amount} emotes ! you can change this amount with **.antiemote 0-9**`
        );
      } else {
        message.channel.send("emote limiting is now off !");
      }

      let query = `mutation{
                setEmoteLimit(guild_id: "${
                  message.guild.id
                }", emote_limit: ${!server.emote_limit}){
                    guild_id
                }
            }`;
      try {
        await request(url, query);
        server.emote_limit = !server.emote_limit;
      } catch (err) {
        console.error(err);
      }
    }

    async function setLimit(num) {
      let query = `mutation{
                setEmoteAmount(guild_id: "${message.guild.id}", emote_amount: ${num}){
                    guild_id
                }
            }`;
      try {
        await request(url, query);
        server.emote_amount = num;
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
  }
};
