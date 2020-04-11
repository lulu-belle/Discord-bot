const Discord = require("discord.js");
const { request } = require("graphql-request");

module.exports = async (client, memberOld, memberNew) => {
  let boosterRoleID = null;
  memberNew.guild.roles.map(r => {
    if (r.name === "Nitro Booster") boosterRoleID = r.id;
  });

  if (
    boosterRoleID &&
    (memberNew._roles.includes(boosterRoleID) ||
      memberOld._roles.includes(boosterRoleID))
  ) {
    let user = null;

    let url = "";

    let query = `{
                getUser(guild_id: "${memberNew.guild.id}", user_id: "${memberNew.user.id}") {
                    guild_id user_id booster
                }
            }`;
    try {
      user = await request(url, query);
    } catch (err) {
      console.error(err);
    }

    if (
      //if booster role added
      boosterRoleID &&
      !memberOld._roles.includes(boosterRoleID) &&
      memberNew._roles.includes(boosterRoleID) &&
      user &&
      "getUser" in user &&
      user.getUser.booster === false
    ) {
      const messageEmbed = new Discord.RichEmbed()
        .setDescription(
          `🎉 **${memberNew.user.username}** vient de boost **${memberNew.guild.name}** !\n\nVous débloquez des avantages sur le Discord.\n\nMerci beaucoup pour votre soutien !`
        )
        .setColor("#f5acba")
        .setThumbnail(memberNew.user.avatarURL);

      if (memberNew.guild.id === "559560674246787087") {
        let s = client.guilds
          .get("559560674246787087")
          .channels.get("663920241990172692");

        s.send(messageEmbed).then(m => m.react("575053165804912652"));

        memberNew.send(
          `Thanks for boosting the serveur ! i can give you a custom role !\nfigure out a name a hex-code value like #fdd1ff !! once you are ready use the command **.setboosterrole** in here or in any of the **Our Home** channels !`
        );
      } else if (memberNew.guild.id === "664351758344257537") {
        let s = client.guilds
          .get("664351758344257537")
          .channels.get("664357218719629312");

        s.send(messageEmbed).then(m => m.react("575053165804912652"));
      }
      query = `mutation{
                setBooster(guild_id: "${memberNew.guild.id}", user_id: "${memberNew.user.id}", booster: true) {
                    guild_id user_id booster
                }
            }`;
      try {
        await request(url, query);
      } catch (err) {
        console.error(err);
      }
    } else if (
      //if booster role remove
      boosterRoleID &&
      memberOld._roles.includes(boosterRoleID) &&
      !memberNew._roles.includes(boosterRoleID) &&
      user &&
      "getUser" in user &&
      user.getUser.booster === true
    ) {
      if (memberNew.guild.id === "559560674246787087") {
        let s = await client.guilds.get("559560674246787087");
        let c = await s.channels.get("561372938474094603");

        c.send(
          `**${memberNew.user.username}** is no longer boosting the serveur !`
        );
        query = `{
                getBoosterRoles(guild_id: "${memberNew.guild.id}", booster: true) {
                    guild_id user_id booster_role
                }
            }`;
        try {
          boosterRoles = await request(url, query);
          for (let i in boosterRoles.getBoosterRoles) {
            if (boosterRoles.getBoosterRoles[i].user_id === memberNew.user.id) {
              query = `mutation {
                setBoosterRole(guild_id: "${s.id}", user_id: "${memberNew.user.id}", booster_role: "") {
                  booster_role
                }
              }`;
              try {
                await request(url, query);
                let guildRole = await s.roles.get(
                  boosterRoles.getBoosterRoles[i].booster_role
                );
                await guildRole.delete();
              } catch (err) {
                console.error(err);
              }
            }
          }
        } catch (err) {
          console.error(err);
        }
      } else if (memberNew.guild.id === "664351758344257537") {
        let s = client.guilds
          .get("664351758344257537")
          .channels.get("664364035386507274");

        s.send(
          `**${memberNew.user.username}** is no longer boosting the serveur !`
        );
      }

      query = `mutation{
                setBooster(guild_id: "${memberNew.guild.id}", user_id: "${memberNew.user.id}", booster: false) {
                    guild_id user_id booster
                }
            }`;
      try {
        await request(url, query);
      } catch (err) {
        console.error(err);
      }
    }
  }
};
