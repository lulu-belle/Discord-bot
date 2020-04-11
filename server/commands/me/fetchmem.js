const { request } = require("graphql-request");

exports.run = async (client, message) => {
  if (
    message.author.id == "157673412561469440" ||
    message.author.id == "630573404352937996" ||
    message.author.id == "601825955572350976"
  ) {
    message.channel.send("are you sure ??").then(() => {
      message.channel
        .awaitMessages(res => res.author.id === message.author.id, {
          maxMatches: 1,
          time: 60000,
          errors: ["time"]
        })
        .then(async collected => {
          if (
            collected
              .first()
              .content.toLowerCase()
              .replace(/\s/g, "") === "y" ||
            collected
              .first()
              .content.toLowerCase()
              .replace(/\s/g, "") === "yes"
          ) {
            let members = await message.guild.fetchMembers();

            let boosterRoleID = null;
            await Promise.all(
              message.guild.roles.map(r => {
                if (r.name === "Nitro Booster") boosterRoleID = r.id;
              })
            );

            members.members.map(async mem => {
              let booster = false;

              if (mem._roles.includes(boosterRoleID)) {
                booster = true;
              }

              let query = `mutation {
            addUser(guild_id: "${message.guild.id}", user_id: "${
                mem.user.id
              }", join_date: "${
                mem.joinedTimestamp
                }", strikes: ${0}, booster: ${booster}, welcome_points: ${0}) {
              guild_id user_id join_date strikes booster welcome_points
            }
          }`;
              let url = "";
              try {
                await request(url, query);
              } catch (err) {
                console.error(err);
              }
            });
          } else {
            return;
          }
        });
    });
  }
};
