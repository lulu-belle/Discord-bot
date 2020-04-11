const _ = require("lodash");
const schedule = require("node-schedule");
const { request } = require("graphql-request");
const moment = require("moment");
const reactionRoleHelper = require("../data/reactionRoleHelper");
const serverMain = require("../data/serverMain");
const userMain = require("../data/userMain");

module.exports = async client => {
  console.log("started");

  //---------------- status --------------------------------------------------------------------------------------------------------
  client.user.setStatus("idle");

  client.user.setActivity("mon fils stp pas touche", {
    type: 3
  });
  //---------------- status --------------------------------------------------------------------------------------------------------

  let url = "";

  //---------------- servers --------------------------------------------------------------------------------------------------------
  let query = `query {
                      getServers {
                          guild_id muted_role mod_channel raid_mode raid_mode_active blank_avatar join_age new_member_roles message_log mention_limit mention_amount emote_limit emote_amount everyone_warn anti_referral anti_invite dup_watch dup_limit
                      }
                    }`;
  try {
    let res = await request(url, query);
    for (let i in res.getServers) {
      serverMain.set(res.getServers[i].guild_id, res.getServers[i]);
    }
    console.log(serverMain);
  } catch (err) {
    console.error(err);
  }
  //---------------- servers --------------------------------------------------------------------------------------------------------
  //---------------- users --------------------------------------------------------------------------------------------------------
  query = `query {
                      getUsers {
                          guild_id user_id join_date strikes booster welcome_points
                      }
                    }`;
  try {
    let res = await request(url, query);
    serverMain.forEach(s => {
      userMain.set(s.guild_id, { users: [] });
    });
    for (let i in res.getUsers) {
      serverMain.forEach(s => {
        if (res.getUsers[i].guild_id === s.guild_id) {
          let serverUsers = userMain.get(s.guild_id);
          serverUsers.users.push(res.getUsers[i]);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
  //---------------- servers --------------------------------------------------------------------------------------------------------
  //---------------- schdules --------------------------------------------------------------------------------------------------------
  query = `query {
                      getSchedules {
                          guild_id channel_id user_id dm_user message date
                      }
                    }`;
  try {
    let res = await request(url, query);
    console.log(res);
    for (let i in res.getSchedules) {
      if (moment(res.getSchedules[i].date).diff(new Date(), "days", true) > 0) {
        schedule.scheduleJob(res.getSchedules[i].date, async () => {
          if (res.getSchedules[i].message.indexOf("roleremove") >= 0) {
            let messageArray = res.getSchedules[i].message.split(/[\s]/g);
            if (messageArray[1]) {
              let s = await client.guilds.get(res.getSchedules[i].guild_id);
              s.fetchMember(res.getSchedules[i].user_id).then(async m => {
                let roleArray = m._roles;
                for (let i in roleArray) {
                  if (roleArray[i] === messageArray[1]) {
                    roleArray.splice(i, 1);
                    message.member.setRoles(roleArray);
                    query = `mutation {
                        setTempRole(guild_id: "${s.id}", user_id: "${res.getSchedules[i].user_id}", temp_role: "") {
                        temp_role
                        }
                        }`;
                    try {
                      await request(url, query);
                      let guildRole = await s.roles.get(
                        res.getSchedules[i].user_id
                      );
                      if (guildRole) {
                        guildRole.delete();
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }
              });
            }
          } else if (res.getSchedules[i].dm_user) {
            let s = await client.guilds.get(res.getSchedules[i].guild_id);
            s.fetchMember(res.getSchedules[i].user_id).then(m =>
              m.send(res.getSchedules[i].message)
            );
          } else {
            let c = await client.channels.get(res.getSchedules[i].channel_id);
            c.send(res.getSchedules[i].message);
          }
        });
      } else {
        query = `mutation {
                      deleteSchedules(guild_id: "${res.getSchedules[i].guild_id}", message: "${res.getSchedules[i].message}", date: "${res.getSchedules[i].date}"){
                          guild_id
                      }
                    }`;
        try {
          await request(url, query);
        } catch (err) {
          console.error(err);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
  //---------------- schdules --------------------------------------------------------------------------------------------------------
  //---------------- reaction roles --------------------------------------------------------------------------------------------------------
  query = `query {
      getReactionRoles {
        guild_id channel_id role_id emote message_id
      }
    }`;
  try {
    let res = await request(url, query);
    console.log(res);
    for (let i in res.getReactionRoles) {
      try {
        let c = await client.channels.get(res.getReactionRoles[i].channel_id);
        c.fetchMessage(res.getReactionRoles[i].message_id)
          .then(() => {
            reactionRoleHelper.addReactionRole(
              res.getReactionRoles[i].guild_id,
              res.getReactionRoles[i].channel_id,
              res.getReactionRoles[i].role_id,
              res.getReactionRoles[i].emote,
              res.getReactionRoles[i].message_id
            );
          })
          .catch(async () => {
            await deleteReactionRole(
              res.getReactionRoles[i].guild_id,
              res.getReactionRoles[i].channel_id,
              res.getReactionRoles[i].role_id,
              res.getReactionRoles[i].emote,
              res.getReactionRoles[i].message_id
            );
          });
      } catch (err) {
        await deleteReactionRole(
          res.getReactionRoles[i].guild_id,
          res.getReactionRoles[i].channel_id,
          res.getReactionRoles[i].role_id,
          res.getReactionRoles[i].emote,
          res.getReactionRoles[i].message_id
        );
      }
    }
  } catch (err) {
    console.error(err);
  }

  async function deleteReactionRole(
    guild_id,
    channel_id,
    role_id,
    emote,
    message_id
  ) {
    query = `mutation {
            deleteReactionRoles(guild_id: "${guild_id}", channel_id: "${channel_id}", role_id: "${role_id}", emote: "${emote}", message_id: "${message_id}") {
              guild_id 
            }
          }`;
    try {
      await request(url, query);
    } catch (err) {
      console.error(err);
    }
  }
  //---------------- reaction roles --------------------------------------------------------------------------------------------------------
  //---------------- fetch reaction roles + react --------------------------------------------------------------------------------------------------------
  const server1 = await client.guilds.get("559560674246787087");
  await server1.channels
    .get("559709338638352405")
    .fetchMessage("662982653074472960");

  //roles reaction messages below
  await server1.channels
    .get("561423217709940770")
    .fetchMessage("663887669939535903")
    .then(async msg => {
      //age
      if (_.size(msg.reactions) === 0) {
        await msg.react("1️⃣");
        await msg.react("2️⃣");
        await msg.react("3️⃣");
        await msg.react("4️⃣");
        await msg.react("5️⃣");
      }
    });
  await server1.channels
    .get("561423217709940770")
    .fetchMessage("663887880153989181")
    .then(async msg => {
      //gender
      if (_.size(msg.reactions) === 0) {
        await msg.react("❤️");
        await msg.react("💙");
        await msg.react("663877883453767680");
        await msg.react("663877938873106432");
        await msg.react("593245255583924239");
        await msg.react("🍓");
      }
    });
  await server1.channels
    .get("561423217709940770")
    .fetchMessage("663888106998464544")
    .then(async msg => {
      //personality
      if (_.size(msg.reactions) === 0) {
        await msg.react("🤐");
        await msg.react("🥳");
        await msg.react("😜");
      }
    });
  await server1.channels
    .get("561423217709940770")
    .fetchMessage("663888254017470483")
    .then(async msg => {
      //gaming
      if (_.size(msg.reactions) === 0) {
        await msg.react("🅿");
        await msg.react("❎");
        await msg.react("🍄");
        await msg.react("🖥");
        await msg.react("📱");
      }
    });
  await server1.channels
    .get("561423217709940770")
    .fetchMessage("663888532959657988")
    .then(async msg => {
      //relationship
      if (_.size(msg.reactions) === 0) {
        await msg.react("💁‍♀️");
        await msg.react("❤");
        await msg.react("🙊");
      }
    });
  await server1.channels
    .get("561423217709940770")
    .fetchMessage("663888692573765634")
    .then(async msg => {
      //dm
      if (_.size(msg.reactions) === 0) {
        await msg.react("✅");
        await msg.react("❌");
        await msg.react("❓");
      }
    });
  await server1.channels
    .get("561423217709940770")
    .fetchMessage("663888853203157004")
    .then(async msg => {
      //interests
      if (_.size(msg.reactions) === 0) {
        await msg.react("🍲");
        await msg.react("🐕");
        await msg.react("🌄");
        await msg.react("⚽");
        await msg.react("🎵");
        await msg.react("🚗");
        await msg.react("📚");
        await msg.react("📺");
        await msg.react("💻");
        await msg.react("🌺");
        await msg.react("🖌️");
        await msg.react("🎮");
        await msg.react("👗");
      }
    });
  await server1.channels
    .get("561423217709940770")
    .fetchMessage("663889028315217935")
    .then(async msg => {
      //voicechat
      if (_.size(msg.reactions) === 0) {
        await msg.react("🎙️");
        await msg.react("👋");
      }
    });

  //-----------------------------------
  const server2 = await client.guilds.get("664351758344257537");
  await server2.channels
    .get("664356808428879882")
    .fetchMessage("664398194431754242");

  await server2.channels
    .get("664362973980000296")
    .fetchMessage("664779018481958943")
    .then(async msg => {
      //age
      if (_.size(msg.reactions) === 0) {
        await msg.react("1️⃣");
        await msg.react("2️⃣");
        await msg.react("3️⃣");
        await msg.react("4️⃣");
      }
    });
  await server2.channels
    .get("664362973980000296")
    .fetchMessage("664779140892983316")
    .then(async msg => {
      //gender
      if (_.size(msg.reactions) === 0) {
        await msg.react("❤️");
        await msg.react("💙");
        await msg.react("663877883453767680");
        await msg.react("663877938873106432");
      }
    });

  await server2.channels
    .get("664362973980000296")
    .fetchMessage("664779339035836417")
    .then(async msg => {
      //gaming
      if (_.size(msg.reactions) === 0) {
        await msg.react("1️⃣");
        await msg.react("2️⃣");
        await msg.react("3️⃣");
        await msg.react("4️⃣");
        await msg.react("5️⃣");
        await msg.react("6️⃣");
        await msg.react("7️⃣");
      }
    });
  await server2.channels
    .get("664362973980000296")
    .fetchMessage("664781016879333397")
    .then(async msg => {
      //relationship
      if (_.size(msg.reactions) === 0) {
        await msg.react("❤");
        await msg.react("💘");
        await msg.react("🖤");
      }
    });
  await server2.channels
    .get("664362973980000296")
    .fetchMessage("664781128594620416")
    .then(async msg => {
      //dm
      if (_.size(msg.reactions) === 0) {
        await msg.react("⭕");
        await msg.react("❌");
        await msg.react("🚫");
      }
    });
  await server2.channels
    .get("664362973980000296")
    .fetchMessage("664781295624126484")
    .then(async msg => {
      //interests
      if (_.size(msg.reactions) === 0) {
        await msg.react("💢");
        await msg.react("📚");
        await msg.react("🐶");
        await msg.react("🎨");
        await msg.react("🎥");
        await msg.react("💪");
        await msg.react("🎮");
        await msg.react("💤");
        await msg.react("👀");
        await msg.react("🎵");
        await msg.react("🌺");
        await msg.react("💾");
      }
    });
  await server2.channels
    .get("664362973980000296")
    .fetchMessage("664781416764014604")
    .then(async msg => {
      //voicechat
      if (_.size(msg.reactions) === 0) {
        await msg.react("🎙️");
        await msg.react("👋");
      }
    });
  await server2.channels
    .get("664362973980000296")
    .fetchMessage("664781943019143172")
    .then(async msg => {
      //nsfw
      if (_.size(msg.reactions) === 0) {
        await msg.react("🔞");
      }
    });
  //---------------- fetch reaction roles + react --------------------------------------------------------------------------------------------------------
};
