const _ = require("lodash");

let welcomePointListHelper = (module.exports = {
  welcomePointsArray: [],
  addMemberList: async (messageId, welcomePointsArray) => {
    welcomePointListHelper.welcomePointsArray = [];
    welcomePointListHelper.welcomePointsArray.push(messageId);
    welcomePointListHelper.welcomePointsArray.push(welcomePointsArray);
    let pageObj = {
      currentPage: 1,
      maxPage: Math.floor(Number(_.size(welcomePointsArray)) / 25) + 1
    };
    welcomePointListHelper.welcomePointsArray.push(pageObj); //page
  },
  changePage: async page => {
    welcomePointListHelper.welcomePointsArray[2].currentPage += page;
  }
});
