const { request } = require("graphql-request");
const _ = require("lodash");
const serverMain = require("../data/serverMain");

module.exports = async (client, guild) => {
  let url = "";

  let members = await guild.fetchMembers();
  let boosterRoleID = null;
  let mutedRoleID = null;
  guild.roles.map(r => {
    if (r.name === "Nitro Booster") boosterRoleID = r.id;
    else if (r.name.toLowerCase() === "muted") mutedRoleID = r.id;
  });

  members.members.map(async mem => {
    let booster = false;

    await Promise.all(
      mem.roles.map(r => {
        if ((r.name = "Nitro Booster")) booster = true;
      })
    );
    let query = `mutation {
            addUser(guild_id: "${guild.id}", user_id: "${
      mem.user.id
    }", join_date: "${
      mem.joinedTimestamp
    }", strikes: ${0}, booster: ${booster}) {
              guild_id user_id join_date strikes booster
            }
          }`;
    try {
      await request(url, query);
    } catch (err) {
      console.error(err);
    }
  });

  mutedRoleID = mutedRoleID ? `${mutedRoleID.toString}` : null;

  let query = `mutation {
            addServer(guild_id: "${
              guild.id
            }", blank_avatar: ${false}, join_age: ${false}, muted_role: ${mutedRoleID}, mod_channel: ${null}, raid_mode: ${false}, raid_mode_active: ${false}, new_member_roles: ${null}, message_log: ${null}, mention_limit: ${false}, mention_amount: ${5}, emote_limit: ${false}, emote_amount: ${5}, everyone_warn: ${false}), anti_referral: ${false}, anti_invite: ${false}, dup_watch: ${false}, dup_limit: ${3}) {
              guild_id
            }
          }`;
  try {
    await request(url, query);
    serverMain.set(guild.id, {
      guild_id: guild.id,
      muted_role: mutedRoleID,
      mod_channel: null,
      raid_mode: false,
      raid_mode_active: false,
      blank_avatar: false,
      join_age: false,
      mention_limit: false,
      mention_amount: 5,
      emote_limit: false,
      emote_amount: 5,
      everyone_warn: false,
      anti_referral: false,
      anti_invite: false,
      dup_watch: false,
      dup_limit: 3
    });
  } catch (err) {
    console.error(err);
  }
};
