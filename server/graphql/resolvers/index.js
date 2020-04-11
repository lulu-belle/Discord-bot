const usersResolvers = require("./users");
const countResolvers = require("./count");
const serverResolvers = require("./server");
const defaultResolvers = require("./default");
const messageResolvers = require("./message");
const shipResolvers = require("./ship");
const schedulesResolvers = require("./schedules");
// const boosterrolesResolvers = require("./boosterroles");
const reactionrolesResolvers = require("./reactionroles");

module.exports = {
  Query: {
    ...usersResolvers.Query,
    ...countResolvers.Query,
    ...serverResolvers.Query,
    ...defaultResolvers.Query,
    ...messageResolvers.Query,
    ...shipResolvers.Query,
    ...schedulesResolvers.Query,
    // ...boosterrolesResolvers.Query,
    ...reactionrolesResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...countResolvers.Mutation,
    ...serverResolvers.Mutation,
    ...defaultResolvers.Mutation,
    ...messageResolvers.Mutation,
    ...shipResolvers.Mutation,
    ...schedulesResolvers.Mutation,
    // ...boosterrolesResolvers.Mutation,
    ...reactionrolesResolvers.Mutation
  }
};
