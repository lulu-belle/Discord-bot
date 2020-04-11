let reactionRoleHelper = (module.exports = {
  reactionRoleList: [],
  addReactionRole: async (guildId, channelId, roleId, emote, messageId) => {
    let reactionRoleObj = {
      guild_id: guildId,
      channel_id: channelId,
      role_id: roleId,
      emote: emote,
      message_id: messageId
    };
    reactionRoleHelper.reactionRoleList.push(reactionRoleObj);
  }
});
