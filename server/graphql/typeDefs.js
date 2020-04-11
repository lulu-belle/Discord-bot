const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    guild_id: String!
    user_id: String!
    join_date: String!
    strikes: Int
    booster: Boolean!
    booster_role: String
    custom_role: String
    welcome_points: Int!
    temp_role: String
  }
  type Count {
    guild_id: String!
    members: Int!
    timestamp: String!
  }
  type Server {
    guild_id: String!
    muted_role: String
    mod_channel: String
    raid_mode: Boolean
    raid_mode_active: Boolean
    blank_avatar: Boolean
    join_age: Boolean
    new_member_roles: [String]
    message_log: String
    mention_limit: Boolean
    mention_amount: Int
    emote_limit: Boolean
    emote_amount: Int
    everyone_warn: Boolean
    anti_referral: Boolean
    anti_invite: Boolean
    dup_watch: Boolean
    dup_limit: Int
  }
  type Default {
    guild_id: String!
    channel_id: String!
    mod_channel_id: String!
    user_id: String!
  }
  type Message {
    guild_id: String!
    channel_id: String!
    channel_name: String!
    message_count: Int!
    day: String!
  }
  type Ship {
    guild_id: String
    user_id: String
    ship_id: String
    timestamp: String
  }
  type Schedules {
    guild_id: String
    channel_id: String
    user_id: String
    dm_user: Boolean
    message: String
    date: String
  }
  type Reactionroles {
    guild_id: String
    channel_id: String
    role_id: String
    emote: String
    message_id: String
  }
  type Query {
    getUser(guild_id: String!, user_id: String!): User
    getUsers: [User]
    getBoosterRoles(guild_id: String, booster: Boolean): [User]
    getCount(guild_id: String!): [Count]
    getCounts: [Count]
    getServers: [Server]
    getDefaults: [Default]
    getMessages(guild_id: String!): [Message]
    getMessage(guild_id: String!, channel_id: String!, day: String!): Message!
    getShips(guild_id: String!): [Ship]
    getShip(guild_id: String!, user_id: String!): Ship
    getSchedules: [Schedules]
    getReactionRoles: [Reactionroles]
  }
  type Mutation {
    addUser(
      guild_id: String!
      user_id: String!
      join_date: String!
      strikes: Int!
      booster: Boolean!
      welcome_points: Int!
    ): User!
    addStrike(guild_id: String!, user_id: String!, strikes: Int): User!
    setBooster(guild_id: String!, user_id: String!, booster: Boolean): User!
    addWelcomePoints(
      guild_id: String!
      user_id: String!
      welcome_points: Int
    ): User!
    setTempRole(guild_id: String!, user_id: String!, temp_role: String): User
    setBoosterRole(
      guild_id: String
      user_id: String
      booster_role: String
    ): User
    setCustomRole(guild_id: String, user_id: String!, custom_role: String): User

    addCount(guild_id: String!, members: Int!, timestamp: String!): Count!

    addServer(
      guild_id: String!
      muted_role: String
      mod_channel: String
      raid_mode: Boolean
      raid_mode_active: Boolean
      blank_avatar: Boolean!
      join_age: Boolean!
      new_member_roles: [String]
      message_log: String
      mention_limit: Boolean
      mention_amount: Int
      emote_limit: Boolean
      emote_amount: Int
      everyone_warn: Boolean
      anti_referral: Boolean
      anti_invite: Boolean
      dup_watch: Boolean
      dup_limit: Int
    ): Server!
    setJoinAge(guild_id: String!, join_age: Boolean): Server
    setBlankAvatar(guild_id: String!, blank_avatar: Boolean): Server
    setMutedRole(guild_id: String!, muted_role: String): Server
    setRaidMode(guild_id: String!, raid_mode: Boolean): Server
    setRaidModeActive(guild_id: String!, raid_mode_active: Boolean): Server
    setNewMemberRoles(guild_id: String!, new_member_roles: [String]): Server
    setModChannel(guild_id: String!, mod_channel: String): Server
    setMessageLog(guild_id: String!, message_log: String): Server
    setMentionLimit(guild_id: String!, mention_limit: Boolean): Server
    setMentionAmount(guild_id: String!, mention_amount: Int): Server
    setEmoteLimit(guild_id: String!, emote_limit: Boolean): Server
    setEmoteAmount(guild_id: String!, emote_amount: Int): Server
    setEveryoneWarn(guild_id: String!, everyone_warn: Boolean): Server
    setAntiReferral(guild_id: String!, anti_referral: Boolean): Server
    setAntiInvite(guild_id: String!, anti_invite: Boolean): Server
    setDupWatch(guild_id: String!, dup_watch: Boolean): Server
    setDupLimit(guild_id: String!, dup_limit: Int): Server

    setDefault(
      guild_id: String!
      channel_id: String!
      mod_channel_id: String!
      user_id: String!
    ): Default

    addMessage(
      guild_id: String!
      channel_id: String!
      channel_name: String!
      message_count: Int!
      day: String!
    ): Message!
    updateMessage(
      guild_id: String!
      channel_id: String!
      channel_name: String!
      message_count: Int
      day: String!
    ): Message!

    addShip(
      guild_id: String
      user_id: String
      ship_id: String
      timestamp: String
    ): Ship
    deleteShip(guild_id: String, user_id: String): Ship

    addSchedules(
      guild_id: String
      channel_id: String
      user_id: String
      dm_user: Boolean
      message: String
      date: String
    ): Schedules
    deleteSchedules(guild_id: String, message: String, date: String): Schedules

    addReactionRoles(
      guild_id: String
      channel_id: String
      role_id: String
      emote: String
      message_id: String
    ): Reactionroles
    deleteReactionRoles(
      guild_id: String
      channel_id: String
      role_id: String
      emote: String
      message_id: String
    ): Reactionroles
  }
`;
