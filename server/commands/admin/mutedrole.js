const serverMain = require("../../data/serverMain");
const { request } = require("graphql-request");

exports.run = async (client, message, args) => {
  let server = serverMain.get(message.guild.id);

  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(
      `How dare you ${message.author.username} !! You don't have the permissions to use this command!`
    );
    message.channel.send("<:natsukiMad:646210751417286656>");
  } else {
    if (server && server.muted_role) {
      let role = await message.guild.roles.get(server.muted_role);
      if (role) {
        if (args[1]) {
          let newRole = await getMutedRole(args[1].trim());
          if (role)
            return message.channel.send(
              `okay i changed the muted role from **@${role.name}** to **@${newRole}** !!`
            );
          else
            return message.channel.send(
              `the current muted role is set to **@${
                role.name
              }**, sorry but i cannot find a role using **${collected
                .first()
                .content.trim()}** to change it to`
            );
        } else {
          await message.channel
            .send(
              `i already have the muted role set to **@${role.name}**, if you would like to change it please give me the exact name of the role, the role id, or mention the role !`
            )
            .then(async () => {
              await message.channel
                .awaitMessages(res => res.author.id === message.author.id, {
                  max: 1,
                  time: 60000,
                  errors: ["time"]
                })
                .then(async collected => {
                  role = await getMutedRole(collected.first().content.trim());
                  if (role)
                    return message.channel.send(
                      `okay i set the muted role to **@${role}** !!`
                    );
                  else
                    return message.channel.send(
                      `sorry but i cannot find a role using **${collected
                        .first()
                        .content.trim()}**`
                    );
                });
            });
        }
      } else if (args[1]) {
        role = await getMutedRole(args[1].trim());
        if (role)
          return message.channel.send(
            `okay i set the muted role to **@${role}** !!`
          );
        else
          return message.channel.send(
            `sorry but i cannot find a role using **${args[1].trim()}**`
          );
      } else {
        message.channel
          .send(
            `the current muted role is incorrect, can you please give me the exact name of the role, the role id, or mention the role ??`
          )
          .then(() => {
            message.channel
              .awaitMessages(res => res.author.id === message.author.id, {
                max: 1,
                time: 60000,
                errors: ["time"]
              })
              .then(async collected => {
                role = await getMutedRole(collected.first().content.trim());
                if (role)
                  return message.channel.send(
                    `okay i set the muted role to **@${role}** !!`
                  );
                else
                  return message.channel.send(
                    `sorry but i cannot find a role using **${collected
                      .first()
                      .content.trim()}**`
                  );
              });
          });
      }
    } else {
      if (args[1]) {
        let role = await getMutedRole(args[1].trim());
        if (role)
          return message.channel.send(
            `okay i set the muted role to **@${role}** !!`
          );
        else
          return message.channel.send(
            `sorry but i cannot find a role using **${args[1].trim()}**`
          );
      } else {
        message.channel
          .send(
            `i dont have anything set for the muted role, can you please give me the exact name of the role, the role id, or mention the role ??`
          )
          .then(() => {
            message.channel
              .awaitMessages(res => res.author.id === message.author.id, {
                max: 1,
                time: 60000,
                errors: ["time"]
              })
              .then(async collected => {
                let role = await getMutedRole(collected.first().content.trim());
                if (role)
                  return message.channel.send(
                    `okay i set the muted role to **@${role}** !!`
                  );
                else
                  return message.channel.send(
                    `sorry but i cannot find a role using **${collected
                      .first()
                      .content.trim()}**`
                  );
              });
          });
      }
    }
  }
  async function getMutedRole(content) {
    let role = await message.guild.roles.get(content.replace(/([^0-9])/g, ""));
    if (role !== undefined) {
      server.muted_role = role.id;
      await addToDatabase(role.id);
      return role.name;
    } else {
      await Promise.all(
        message.guild.roles.map(r => {
          if (r.name.toLowerCase() === content.toLowerCase()) {
            role = r;
          }
        })
      );
      if (role) {
        server.muted_role = role.id;
        await addToDatabase(role.id);
        return role.name;
      } else {
        return null;
      }
    }
  }

  async function addToDatabase(role_id) {
    let url = "";
    query = `mutation{
                setMutedRole(guild_id: "${message.guild.id}", muted_role: "${role_id}"){
                    guild_id
                }
            }`;
    try {
      await request(url, query);
    } catch (err) {
      return console.error(err);
    }
  }
};
