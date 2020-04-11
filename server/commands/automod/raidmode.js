const { request } = require("graphql-request");
const serverMain = require("../../data/serverMain");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (message.member.hasPermission("BAN_MEMBERS")) {
    let server = serverMain.get(message.guild.id);
    let url = "";

    if (args[1]) {
      if (!server.raid_mode) {
        message.channel.send(
          "Raid mode is not active on this serveur, you can activate it with the command **.raidmode** !"
        );
      } else {
        let c = await message.guild.channels.get(server.mod_channel);

        if (
          args[1].trim().toLowerCase() === "stop" ||
          args[1].trim().toLowerCase() === "end" ||
          args[1].trim().toLowerCase() === "off"
        ) {
          if (server.raid_mode_active) {
            setRaidModeActive(false);
            let raidMessage = new Discord.RichEmbed()
              .setAuthor("Raid mode stopped")
              .setDescription(
                `**${message.author.username}**#${message.author.discriminator} deactivated raid mode`
              )
              .setColor("#00ff00")
              .setFooter(
                `${message.guild.name}`,
                "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
              )
              .setTimestamp();

            if (member.guild.icon)
              raidMessage.setThumbnail(member.guild.iconURL);

            if (c) c.send(raidMessage);
            else message.channel.send(raidMessage);
          } else {
            message.channel.send(
              "raid mode is not active silly ! if you want to deactivate the entire module then use the command **.raidmode**"
            );
          }
        } else if (
          args[1].trim().toLowerCase() === "start" ||
          args[1].trim().toLowerCase() === "on"
        ) {
          if (!server.raid_mode_active) {
            setRaidModeActive(true);
            let raidMessage = new Discord.RichEmbed()
              .setAuthor("Raid mode active")
              .setDescription(
                `**${message.author.username}**#${message.author.discriminator} activated raid mode`
              )
              .setColor("#ff0000")
              .setFooter(
                `${message.guild.name}`,
                "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
              )
              .setTimestamp();

            if (member.guild.icon)
              raidMessage.setThumbnail(member.guild.iconURL);

            if (c) c.send(raidMessage);
            else message.channel.send(raidMessage);
          } else {
            message.channel.send(
              "raid mode is already active silly ! if you want to activate the entire module then use the command **.raidmode**"
            );
          }
        }
      }
    } else {
      if (server.raid_mode === false) {
        message.channel.send(
          "Raid mode protection is now active ! no one is getting past me !"
        );
      } else {
        message.channel.send(
          "Raid mode protection is not active ! make sure you turn this on or use another bot for this !!"
        );
      }

      let query = `mutation{
                setRaidMode(guild_id: "${
                  message.guild.id
                }", raid_mode: ${!server.raid_mode}){
                    guild_id
                }
            }`;
      try {
        await request(url, query);
        server.raid_mode = !server.raid_mode;
      } catch (err) {
        console.error(err);
      }
    }

    async function setRaidModeActive(bool) {
      let query = `mutation{
                setRaidModeActive(guild_id: "${message.guild.id}", raid_mode_active: ${bool}){
                    guild_id
                }
            }`;
      try {
        await request(url, query);
        server.raid_mode_active = bool;
      } catch (err) {
        console.error(err);
      }
    }
  }
};
