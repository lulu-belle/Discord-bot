const { request } = require("graphql-request");
const serverMain = require("../../data/serverMain");

exports.run = async (client, message, args) => {
  if (message.member.hasPermission("BAN_MEMBERS")) {
    let server = serverMain.get(message.guild.id);

    if (server.join_age === false) {
      message.channel.send(
        "current setting is false to kicking accounts under 7 days old, **changing it to true** !\nAccounts under 7 days old will now be kicked !!"
      );
    } else {
      message.channel.send(
        "current setting is true to kicking accounts under 7 days old, **changing it to false** !\nAccounts under 7 days old will not be kicked !!"
      );
    }
    let url = "";

    let query = `mutation{
                setJoinAge(guild_id: "${
                  message.guild.id
                }", join_age: ${!server.join_age}){
                    guild_id
                }
            }`;
    try {
      await request(url, query);
      server.join_age = !server.join_age;
    } catch (err) {
      console.error(err);
    }
  }
};
