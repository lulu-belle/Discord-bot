const { request } = require("graphql-request");
const serverMain = require("../../data/serverMain");

exports.run = async (client, message, args) => {
  if (message.member.hasPermission("BAN_MEMBERS")) {
    let server = serverMain.get(message.guild.id);

    if (server.blank_avatar === false) {
      message.channel.send(
        "current setting is false to kicking accounts without avatars, **changing it to true** !\nAccounts without avatars will now be kicked !!"
      );
    } else {
      message.channel.send(
        "current setting is true to kicking accounts without avatars, **changing it to false** !\nAccounts without avatars will not be kicked !!"
      );
    }
    let url = "";

    let query = `mutation{
                setBlankAvatar(guild_id: "${
                  message.guild.id
                }", blank_avatar: ${!server.blank_avatar}){
                    guild_id
                }
            }`;
    try {
      await request(url, query);
      server.blank_avatar = !server.blank_avatar;
    } catch (err) {
      console.error(err);
    }
  }
};
