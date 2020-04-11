const { request } = require("graphql-request");
const serverMain = require("../../data/serverMain");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (message.member.hasPermission("BAN_MEMBERS")) {
    let server = serverMain.get(message.guild.id);
    let url = "";

    if (args[1]) {
      if (server.dup_watch) {
        let num = Number(args[1]);
        if (num && num >= 0 && num < 10) {
          let check = await setLimit(num);
          if (check)
            return message.channel.send(
              `message duplicates will now be limited to ${num} duplicates !`
            );
          else return message.channel.send("sorry i broke something !!");
        } else {
          return message.channel.send(
            `you need to give me a number from 0 to 9 not ${args[1]} !`
          );
        }
      } else {
        return message.channel.send(
          "you need to activate this module with **.duplicatemessage**"
        );
      }
    } else {
      if (server.dup_watch === false) {
        message.channel.send(
          `message duplicates limiting is now active ! messages are limited to ${server.dup_limit} duplicates ! every duplicate message after this amount i will give the user a warning ! you can change this amount with **.antiduplicate 0-9**`
        );
      } else {
        message.channel.send("message duplicates limiting is now off !");
      }

      let query = `mutation{
                setDupWatch(guild_id: "${
                  message.guild.id
                }", dup_watch: ${!server.dup_watch}){
                    guild_id
                }
            }`;
      try {
        await request(url, query);
        server.dup_watch = !server.dup_watch;
      } catch (err) {
        console.error(err);
      }
    }

    async function setLimit(num) {
      let query = `mutation{
                setDupLimit(guild_id: "${message.guild.id}", dup_limit: ${num}){
                    guild_id
                }
            }`;
      try {
        await request(url, query);
        server.dup_limit = num;
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
  }
};
