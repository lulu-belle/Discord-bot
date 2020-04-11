const Discord = require("discord.js");
const _ = require("lodash");
const randomColor = require("../../data/randomColor");
const defaults = require("../../data/defaults");
const levelRoles = require("../../data/levelRoles");

exports.run = async (client, message, args) => {
  const waitFor = ms => new Promise(r => setTimeout(r, ms));

  if (message.guild.id === "559560674246787087") {
    let member = null;

    let level = parseInt(args[7]);

    let memberRolesIdArray = [],
      memberRolesArray = [],
      memberUpdatedRolesArray = null,
      memberRolesArrayNew = [];

    function changeLevelArray(memberRolesLevelsRemovedArray, levelInt) {
      return _.concat(
        memberRolesLevelsRemovedArray,
        levelRoles.ourHome[levelInt + 1]
      );
    }

    function checkLevelChange() {
      member.roles.map(r => memberRolesIdArray.push(r.id));

      let memberHasLevelRole = () => {
        for (let i = 0; i <= levelRoles.ourHome.length; i++) {
          if (memberRolesIdArray.indexOf(levelRoles.ourHome[i]) != -1) {
            //lodash _.findIndex works funky had to remove
            return i;
          }
        }
      };
      let calledMemberHasLevelRole = memberHasLevelRole();

      //remove id from array
      let memberRolesLevelsRemovedArray = _.pull(
        memberRolesIdArray,
        levelRoles.ourHome[calledMemberHasLevelRole]
      );

      // switch (level) { switch slower than if
      if (level >= 90 && member.roles.has(levelRoles.ourHome[9])) {
        memberUpdatedRolesArray = changeLevelArray(
          memberRolesLevelsRemovedArray,
          calledMemberHasLevelRole
        );
        return;
      } else if (level >= 70 && member.roles.has(levelRoles.ourHome[8])) {
        memberUpdatedRolesArray = changeLevelArray(
          memberRolesLevelsRemovedArray,
          calledMemberHasLevelRole
        );
        return;
      } else if (level >= 60 && member.roles.has(levelRoles.ourHome[7])) {
        memberUpdatedRolesArray = changeLevelArray(
          memberRolesLevelsRemovedArray,
          calledMemberHasLevelRole
        );
        return;
      } else if (level >= 50 && member.roles.has(levelRoles.ourHome[6])) {
        memberUpdatedRolesArray = changeLevelArray(
          memberRolesLevelsRemovedArray,
          calledMemberHasLevelRole
        );
        return;
      } else if (level >= 40 && member.roles.has(levelRoles.ourHome[5])) {
        memberUpdatedRolesArray = changeLevelArray(
          memberRolesLevelsRemovedArray,
          calledMemberHasLevelRole
        );
        return;
      } else if (level >= 30 && member.roles.has(levelRoles.ourHome[4])) {
        memberUpdatedRolesArray = changeLevelArray(
          memberRolesLevelsRemovedArray,
          calledMemberHasLevelRole
        );
        return;
      } else if (level >= 20 && member.roles.has(levelRoles.ourHome[3])) {
        memberUpdatedRolesArray = changeLevelArray(
          memberRolesLevelsRemovedArray,
          calledMemberHasLevelRole
        );
        return;
      } else if (level >= 15 && member.roles.has(levelRoles.ourHome[2])) {
        memberUpdatedRolesArray = changeLevelArray(
          memberRolesLevelsRemovedArray,
          calledMemberHasLevelRole
        );
        return;
      } else if (level >= 10 && member.roles.has(levelRoles.ourHome[1])) {
        memberUpdatedRolesArray = changeLevelArray(
          memberRolesLevelsRemovedArray,
          calledMemberHasLevelRole
        );
        return;
      } else if (level >= 3 && member.roles.has(levelRoles.ourHome[0])) {
        memberUpdatedRolesArray = changeLevelArray(
          memberRolesLevelsRemovedArray,
          calledMemberHasLevelRole
        );
        return;
      } else {
        return;
      }
    }

    async function changeLevel(member) {
      if (member) {
        let channelID = await message.guild.channels.get(defaults.ourHome.mod);

        member.roles.map(r => memberRolesArray.push(r));
        memberRolesArray.shift(); //remove everyone role

        let formattedOldRoles = _.orderBy(memberRolesArray, "position", "desc");
        let rolesOldString = _.join(formattedOldRoles, " | ");

        await checkLevelChange();

        if (memberUpdatedRolesArray) {
          try {
            let mem = null;
            await member.setRoles(memberUpdatedRolesArray);
            await waitFor(1000);

            mem = await message.guild.fetchMember(member.id);
            mem.roles.map(r => memberRolesArrayNew.push(r));
            memberRolesArrayNew.shift(); //remove everyone role again

            let formattedNewRoles = _.orderBy(
              memberRolesArrayNew,
              "position",
              "desc"
            );

            let rolesNewString = _.join(formattedNewRoles, " | ");

            let messageEmbed = new Discord.RichEmbed()
              .setColor(randomColor())
              .setTitle(
                `Changed level role for ${mem.user.username}#${mem.user.discriminator}`
              )
              .setThumbnail(mem.user.displayAvatarURL)
              .addField("Old Roles", rolesOldString)
              .addField("New Roles", rolesNewString)
              .setFooter(
                `${message.guild.name}`,
                "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
              )
              .setTimestamp();

            channelID.send(messageEmbed);
          } catch {
            channelID.send("I failed changing roles for a user");
            channelID.send("<:deadinside:606350795881054216>");
          }
        }
      }
    }

    member = message.mentions.members.first();
    changeLevel(member);
  }
};
