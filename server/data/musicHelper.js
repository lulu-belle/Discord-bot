let musicHelper = (module.exports = {
  musicQueue: "",
  setMusicQueue: async newQueue => {
    musicHelper.musicQueue = newQueue;
    console.log("musicHelper", musicHelper.musicQueue);
  }
});
