const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (!args[1]) {
    message.channel.send("there's no role specified !!");
    message.channel.send("<:natsukiMad:646210751417286656>");
  } else {
    let id = args[1].match(/([0-9])\d+/g);

    if (!id || id[0].length !== 18) {
      message.channel.send("Please tell me what role !!");
      message.channel.send("<:natsukiMad:646210751417286656>");
      return;
    }
    if (message.guild.roles.has(id[0])) {
      let i = 0;

      await message.guild.members.map(member => {
        if (member.roles.has(id[0])) {
          i++;
        }
      });

      await message.guild.roles.map(r => {
        if (r.id === id[0]) {
          let messageEmbed = new Discord.RichEmbed()
            .setColor(`#${Number(r.color).toString(16)}`)
            .setTitle(`Role Information for ${r.name}`)
            .setDescription(`ID - ${r.id}`)
            .addField("Members", i, true)
            .addField("Colour", `#${Number(r.color).toString(16)}`, true)
            .addField("Hoist", r.hoist, true)
            .addField("Mentionable", r.mentionable, true)
            .setFooter(
              `${message.guild.name}`,
              "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
            )
            .setTimestamp();
            
          message.channel.send(messageEmbed);
          setTimeout(() => {
            message
              .delete()
              .catch(() =>
                message.channel.send(
                  "I dont have the permission to delete the command message !"
                )
              );
          }, 200);
        }
      });
    } else {
      message.channel.send("I don't think this role exists in the serveur !");
      message.channel.send("<:kanna_confused:607077674099277828>");
      return;
    }
  }
};
