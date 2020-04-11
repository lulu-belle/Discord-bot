const Discord = require("discord.js");
const serverMain = require("../../data/serverMain");
const { request } = require("graphql-request");

exports.run = async (client, message, args) => {
  let server = serverMain.get(message.guild.id);

  if (!message.member.hasPermission("KICK_MEMBERS")) {
    message.channel.send(
      `How dare you ${message.author.username} !! You don't have the permissions to use this command !`
    );
    message.channel.send("<:natsukiMad:646210751417286656>");
  } else {
    if (!args[1]) {
      message.channel.send(help());
    } else {
      let chanId = args[1].trim().replace(/([^0-9])/g, "");
      if (message.guild.channels.has(chanId)) {
        addToDatabase(chanId);
        message.channel.send(
          `okay i will send all mod stuff to ${message.guild.channels.get(
            chanId
          )}`
        );
      } else {
        message.channel.send(
          `i cannot find the channel ${args[1]}, make sure to mention the channel for me <3`
        );
      }
    }
  }

  function help() {
    const embed = new Discord.RichEmbed()
      .setAuthor("Set mod channel help")
      .setDescription(
        "This is so i know where to send messages related to mod things !"
      )
      .setColor("#202225")
      .addField("Example", `.setmodchannel ${message.channel}`)
      .setFooter(
        `${message.guild.name}`,
        "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
      )
      .setTimestamp();
    return embed;
  }

  async function addToDatabase(chan) {
    let url = "";
    query = `mutation{
                setModChannel(guild_id: "${message.guild.id}", mod_channel: "${chan}"){
                    guild_id
                }
            }`;
    try {
      await request(url, query);
      server.mod_channel = chan;
    } catch (err) {
      return console.error(err);
    }
  }
};
