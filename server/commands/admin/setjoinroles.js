const serverMain = require("../../data/serverMain");
const { request } = require("graphql-request");
const Discord = require("discord.js");
const randNum = require("../../data/randomNumber");
const _ = require("lodash");

exports.run = async (client, message, args) => {
  let server = serverMain.get(message.guild.id);

  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(
      `How dare you ${message.author.username} !! You don't have the permissions to use this command!`
    );
    message.channel.send("<:natsukiMad:646210751417286656>");
  } else {
    if (server && server.new_member_roles.length > 0) {
      let str = "";
      for (let i in server.new_member_roles) {
        str += `${message.guild.roles.get(server.new_member_roles[i])} `;
      }

      let newRoles = [];
      for (let i in args) {
        if (i !== 0) {
          await Promise.all(
            message.guild.roles.map(r => {
              if (
                r.id === args[i].replace(/([^0-9])/g, "") ||
                r.name.toLowerCase() === args[i].toLowerCase() ||
                r === args[i]
              ) {
                newRoles.push(r);
              }
            })
          );
        }
      }

      let newRolesNoDups = new Set(newRoles);
      let newRolesArray = [];
      newRolesNoDups.forEach(r => {
        newRolesArray.push(r.id);
      });

      await addToDatabase(newRolesArray);

      let roleStr = _.join(newRoles, " | ");

      let embed = new Discord.RichEmbed()
        .setAuthor("New member roles")
        .setDescription("New members will now be given the **New roles**")
        .addField("Old roles", str.trim().replace(/(\s)/g, " | "))
        .addField("New roles", roleStr)
        .setColor("#202225")
        .setFooter(
          `${message.guild.name}`,
          "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
        )
        .setTimestamp();

      message.channel.send(embed);
    } else {
      if (args[1]) {
        if (args[1].toLowerCase() === "help")
          message.channel.send(newMemberRolesHelp());
        else {
          let roles = [];
          for (let i in args) {
            if (i !== 0) {
              await Promise.all(
                message.guild.roles.map(r => {
                  if (
                    r.id === args[i].replace(/([^0-9])/g, "") ||
                    r.name.toLowerCase() === args[i].toLowerCase() ||
                    r === args[i]
                  ) {
                    roles.push(r);
                  }
                })
              );
            }
          }

          let rolesNoDups = new Set(roles);
          let newRolesArray = [];
          rolesNoDups.forEach(r => {
            newRolesArray.push(r.id.toString());
          });

          await addToDatabase(newRolesArray);

          let roleStr = _.join(roles, " | ");

          let embed = new Discord.RichEmbed()
            .setAuthor("New member roles")
            .setDescription("I will give new members these roles on join")
            .addField("Roles", roleStr)
            .setColor("#202225")
            .setFooter(
              `${message.guild.name}`,
              "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
            )
            .setTimestamp();

          message.channel.send(embed);
        }
      } else {
        message.channel.send(newMemberRolesHelp());
      }
    }
  }

  function newMemberRolesHelp() {
    let embed = new Discord.RichEmbed()
      .setAuthor("New member roles help")
      .setDescription(
        "Use the command **.joineroles** followed by the role id, role mention, or exact role names (can one be 1 word long)"
      )
      .setColor("#202225")
      .addField(
        "Example",
        `.setnewmemberroles 681680958608637984 661681685112422472\n.setnewmemberroles ${message.member.roles.get(
          message.member._roles[randNum(0, message.member._roles.length)]
        )}`
      )
      .setFooter(
        `${message.guild.name}`,
        "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
      )
      .setTimestamp();
    return embed;
  }

  async function addToDatabase(arr) {
    let url = "";
    query = `mutation{
                setNewMemberRoles(guild_id: "${message.guild.id}", new_member_roles: "${arr}"){
                    guild_id
                }
            }`;
    try {
      await request(url, query);
      server.new_member_roles = arr;
    } catch (err) {
      return console.error(err);
    }
  }
};
