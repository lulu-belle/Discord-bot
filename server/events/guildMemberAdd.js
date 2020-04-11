const { request } = require("graphql-request");
const moment = require("moment");
const Discord = require("discord.js");
const raidMode = new Map();
const serverMain = require("../data/serverMain");

function checkMembers(guild) {
  let memberCount = 0;
  guild.members.forEach(member => {
    if (!member.user.bot) memberCount++;
  });
  return memberCount;
}

module.exports = async (client, member) => {
  if (!member.user.bot) {
    let server = serverMain.get(member.guild.id);

    let url = "";

    let query = `mutation {
            addCount (guild_id: "${member.guild.id}", members: ${checkMembers(
      member.guild
    )}, timestamp: "${Date.now()}") {
              guild_id members timestamp
            }
          }`;

    try {
      await request(url, query);
    } catch (err) {
      console.error(err);
    }

    let discordJoinDateDiff = moment.duration(
      moment(new Date().toISOString()).diff(
        moment(new Date(member.user.createdTimestamp).toISOString())
      )
    );
    moment.locale("fr");
    let discordJoinDate = moment(
      new Date(member.user.createdTimestamp).toISOString()
    ).format("D MMM YYYY [à] H:mm");

    let messageEmbed = new Discord.RichEmbed().setColor("#202225");

    if (server.join_age) {
      if (
        discordJoinDateDiff._data.days < 7 &&
        discordJoinDateDiff._data.months < 1 &&
        discordJoinDateDiff._data.years < 1
      ) {
        messageEmbed
          .setAuthor("Notice")
          .setDescription(
            `Thanks for joining **${member.guild.name}** !\n\nUnfortunately we require discord accounts to be at least 7 days old, sorry it is just to help keep bots from joining !\n\nYour account was created on ${discordJoinDate}`
          )
          .setFooter(
            `${member.guild.name}`,
            "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
          )
          .setTimestamp();

        if (member.guild.icon) messageEmbed.setThumbnail(member.guild.iconURL);

        member.send(messageEmbed).then(() => {
          member.kick("account too young !!").catch((err) => console.error(err));
        }).catch((err) => console.error(err));
        return;
      }
    }
    if (server.blank_avatar) {
      if (member.user.avatarURL === null) {
        messageEmbed
          .setAuthor("Notice")
          .setDescription(
            `Thanks for joining **${member.guild.name}** !\n\nUnfortunately we require discord accounts to have an avatar photo, sorry it is just to help keep bots from joining !\n\nYou can get a photo and try again though !!`
          )
          .setFooter(
            `${member.guild.name}`,
            "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
          )
          .setTimestamp();

        if (member.guild.icon) messageEmbed.setThumbnail(member.guild.iconURL);

        member.send(messageEmbed).then(() => {
          member.kick("no avatar photo !!").catch((err) => console.error(err));
        }).catch((err) => console.error(err));
        return;
      }
    }

    messageEmbed
      .setAuthor("New member")
      .setDescription(
        `**${member.user.username}**#${member.user.discriminator} joined !\n(ID:${member.user.id})\n\n**Account created :** ${discordJoinDate}`
      )
      .setColor("#00ff00")
      .setThumbnail(member.user.displayAvatarURL)
      .setFooter(
        `${member.guild.name}`,
        "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
      )
      .setTimestamp();

    let c = await member.guild.channels.get(server.mod_channel);

    if (server.new_member_roles && server.new_member_roles.length > 0) {
      let currentRoles = member._roles;

      for (let i in server.new_member_roles) {
        currentRoles.push(server.new_member_roles[i]);
      }

      member.setRoles(currentRoles).catch(async err => {
        let str = "";
        for (let i in server.new_member_roles) {
          let role = await member.guild.roles.get(server.new_member_roles[i]);
          str += ` ${role}`;
        }
        messageEmbed.setDescription(
          `**${member.user.username}**#${member.user.discriminator} has joined the server but i failed to give them the roles : ${str} !`
        );
      });
    }

    if (server.raid_mode) {
      if (server.raid_mode_active) {
        if (server.muted_role) member.addRole(server.muted_role);
        messageEmbed
          .setAuthor("Notice")
          .setDescription(
            `Thanks for joining **${member.guild.name}** !\n\nUnfortunately we had a large amount of joins in a few secondes so raid mode was automatically activated ! If you are not a bot you can join again in 30-45 minutes !`
          )
          .setColor("#ff0000");
        if (member.guild.icon) messageEmbed.setThumbnail(member.guild.iconURL);

        member
          .send(messageEmbed)
          .then(() => member.send("kicked")) //member.kick("raid mode")
          .catch(err => console.error(err));
      } else {
        if (raidMode.has(member.guild.id)) {
          server.raid_mode_active = true;

          messageEmbed
            .setAuthor("Notice")
            .setDescription(
              `Thanks for joining **${member.guild.name}** !\n\nUnfortunately we had a large amount of joins in a few secondes so raid mode was automatically activated ! If you are not a bot you can join again in 30-45 minutes !`
            )
            .setColor("#ff0000");
          if (member.guild.icon)
            messageEmbed.setThumbnail(member.guild.iconURL);

          member
            .send(messageEmbed)
            .then(() => member.send("kicked")) //member.kick("raid mode")
            .catch(err => console.error(err));

          raidMode
            .get(member.guild.id)
            .member.send(messageEmbed)
            .then(() =>
              raidMode.get(member.guild.id).member.send("first member kicked")
            ) //member.kick("raid mode")
            .catch(err => console.error(err));

          if (!raidMode.get(member.guild.id).active) {
            raidMode.get(member.guild.id).active = true;

            query = `mutation {
            setRaidModeActive(guild_id: "${
              member.guild.id
            }", raid_mode_active: ${true}){
                    guild_id
                }
          }`;
            try {
              await request(url, query);
              let raidMessage = new Discord.RichEmbed()
                .setAuthor("Raid mode active")
                .setDescription(
                  "I automatically activated raid mode due to the amount of recent join attempts\n\nI will automatically turn it off in 20 minutes"
                )
                .setColor("#ff0000")
                .setFooter(
                  `${member.guild.name}`,
                  "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
                )
                .setTimestamp();
              if (member.guild.icon)
                raidMessage.setThumbnail(member.guild.iconURL);

              if (c) c.send(raidMessage);
            } catch (err) {
              console.error(err);
            }
            setTimeout(async () => {
              raidMode.delete(member.guild.id);
              server.raid_mode_active = false;

              query = `mutation {
            setRaidModeActive(guild_id: "${
              member.guild.id
            }", raid_mode_active: ${false}){
                    guild_id
                }
          }`;

              try {
                await request(url, query);
                raidMessage = new Discord.RichEmbed()
                  .setAuthor("Raid mode stopped")
                  .setDescription("I automatically deactivated raid mode")
                  .setColor("#00ff00")
                  .setFooter(
                    `${member.guild.name}`,
                    "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
                  )
                  .setTimestamp();

                if (member.guild.icon)
                  raidMessage.setThumbnail(member.guild.iconURL);

                if (c) c.send(raidMessage);
              } catch (err) {
                console.error(err);
              }
            }, 1200000);
          }
        } else {
          if (c) c.send(messageEmbed);
          raidMode.set(member.guild.id, {
            member: member,
            active: false
          });
          setTimeout(() => {
            if (!raidMode.get(member.guild.id).active)
              raidMode.delete(member.guild.id);
          }, 10000);
        }
      }
    } else {
      if (c) c.send(messageEmbed);
    }

    query = `query {
            getUser(guild_id: "${member.guild.id}", user_id: "${member.user.id}") {
              guild_id user_id
            }
          }`;

    try {
      let res = await request(url, query);
      if (res.getUser === null) {
        query = `mutation {
            addUser(guild_id: "${member.guild.id}", user_id: "${
          member.user.id
        }", join_date: "${
          member.joinedTimestamp
        }", strikes: ${0}, booster: false, welcome_points: ${0}) {
              guild_id user_id join_date strikes booster welcome_points
            }
          }`;

        try {
          await request(url, query);
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
};
