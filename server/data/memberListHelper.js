const _ = require("lodash");

let memberListHelper = (module.exports = {
  memberList: [],
  addMemberList: async (messageId, memberlist) => {
    memberListHelper.memberList = [];
    memberListHelper.memberList.push(messageId);
    memberListHelper.memberList.push(memberlist);
    let pageObj = {
      currentPage: 1,
      maxPage: Math.floor(Number(_.size(memberlist)) / 25) + 1
    };
    memberListHelper.memberList.push(pageObj); //page
  },
  changePage: async page => {
    memberListHelper.memberList[2].currentPage += page;
  }
});
