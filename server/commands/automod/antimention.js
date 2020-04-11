const { request } = require("graphql-request");
const serverMain = require("../../data/serverMain");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (message.member.hasPermission("BAN_MEMBERS")) {
    let server = serverMain.get(message.guild.id);
    let url = "";

    if (args[1]) {
      if (server.mention_limit) {
        let num = Number(args[1]);
        if (num && num >= 0 && num < 10) {
          let check = await setLimit(num);
          if (check)
            return message.channel.send(
              `messages will now be limited to ${num} mentions !`
            );
          else return message.channel.send("sorry i broke something !!");
        } else {
          return message.channel.send(
            `you need to give me a number from 0 to 9 not ${args[1]} !`
          );
        }
      } else {
        return message.channel.send(
          "you need to activate this module with **.mentionlimit**"
        );
      }
    } else {
      if (server.mention_limit === false) {
        message.channel.send(
          `mentions limiting is now active ! messages are limited to ${server.mention_amount} mentions ! you can change this amount with **.antimention 0-9**`
        );
      } else {
        message.channel.send("mention limiting is now off !");
      }

      let query = `mutation{
                setMentionLimit(guild_id: "${
                  message.guild.id
                }", mention_limit: ${!server.mention_limit}){
                    guild_id
                }
            }`;
      try {
        await request(url, query);
        server.mention_limit = !server.mention_limit;
      } catch (err) {
        console.error(err);
      }
    }

    async function setLimit(num) {
      let query = `mutation{
                setMentionAmount(guild_id: "${message.guild.id}", mention_amount: ${num}){
                    guild_id
                }
            }`;
      try {
        await request(url, query);
        server.mention_amount = num;
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
  }
};
