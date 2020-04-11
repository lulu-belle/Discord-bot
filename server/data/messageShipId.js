let messageShipId = (module.exports = {
  messageIds: [],
  addMessageId: async (messageId, memberOneId, memberTwoId) => {
    let obj = {
      message_id: messageId,
      member_one_id: memberOneId,
      member_two_id: memberTwoId
    };
    messageShipId.messageIds.push(obj);
  },
  deleteMessageIds: async memberId => {
    for (let i = 0; i < messageShipId.messageIds.length; i++) {
      if (
        messageShipId.messageIds[i].member_one_id === memberId ||
        messageShipId.messageIds[i].member_two_id === memberId
      ) {
        messageShipId.messageIds.splice(i, 1);
      }
    }
  }
});
