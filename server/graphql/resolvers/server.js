const Server = require("../models/server");

module.exports = {
  Query: {
    getServers: async () => {
      try {
        const servers = await Server.find();
        return servers;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    addServer: async (_, { guild_id }) => {
      const newServer = new Server({
        guild_id
      });

      //  Create the new server
      const res = await newServer.save();

      return res;
    },
    setJoinAge: async (_, { guild_id, join_age }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          join_age: join_age
        },
        {
          new: true
        }
      );

      return res;
    },
    setBlankAvatar: async (_, { guild_id, blank_avatar }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          blank_avatar: blank_avatar
        },
        {
          new: true
        }
      );

      return res;
    },
    setMutedRole: async (_, { guild_id, muted_role }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          muted_role: muted_role
        },
        {
          new: true
        }
      );
      return res;
    },
    setRaidMode: async (_, { guild_id, raid_mode }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          raid_mode: raid_mode
        },
        {
          new: true
        }
      );
      return res;
    },
    setRaidModeActive: async (_, { guild_id, raid_mode_active }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          raid_mode_active: raid_mode_active
        },
        {
          new: true
        }
      );
      return res;
    },
    setNewMemberRoles: async (_, { guild_id, new_member_roles }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          new_member_roles: new_member_roles
        },
        {
          new: true
        }
      );
      return res;
    },
    setModChannel: async (_, { guild_id, mod_channel }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          mod_channel: mod_channel
        },
        {
          new: true
        }
      );
      return res;
    },
    setMessageLog: async (_, { guild_id, message_log }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          message_log: message_log
        },
        {
          new: true
        }
      );
      console.log(res.data);

      return res;
    },
    setMentionLimit: async (_, { guild_id, mention_limit }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          mention_limit: mention_limit
        },
        {
          new: true
        }
      );

      return res;
    },
    setMentionAmount: async (_, { guild_id, mention_amount }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          mention_amount: mention_amount
        },
        {
          new: true
        }
      );

      return res;
    },
    setEmoteLimit: async (_, { guild_id, emote_limit }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          emote_limit: emote_limit
        },
        {
          new: true
        }
      );

      return res;
    },
    setEmoteAmount: async (_, { guild_id, emote_amount }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          emote_amount: emote_amount
        },
        {
          new: true
        }
      );

      return res;
    },
    setEveryoneWarn: async (_, { guild_id, everyone_warn }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          everyone_warn: everyone_warn
        },
        {
          new: true
        }
      );

      return res;
    },
    setAntiReferral: async (_, { guild_id, anti_referral }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          anti_referral: anti_referral
        },
        {
          new: true
        }
      );

      return res;
    },
    setAntiInvite: async (_, { guild_id, anti_invite }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          anti_invite: anti_invite
        },
        {
          new: true
        }
      );

      return res;
    },
    setDupWatch: async (_, { guild_id, dup_watch }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          dup_watch: dup_watch
        },
        {
          new: true
        }
      );

      return res;
    },
    setDupLimit: async (_, { guild_id, dup_limit }) => {
      const res = await Server.findOneAndUpdate(
        {
          guild_id: guild_id
        },
        {
          dup_limit: dup_limit
        },
        {
          new: true
        }
      );

      return res;
    }
  }
};
