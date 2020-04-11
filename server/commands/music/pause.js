const musicHelper = require("../../data/musicHelper");

exports.run = async (client, message, args) => {
  const serverQueue = musicHelper.musicQueue.get(message.guild.id);
  if (serverQueue && serverQueue.playing) {
    if (
      message.member.hasPermission("MANAGE_MESSAGES") ||
      serverQueue.songs[0].requesterId === message.author.id
    ) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      return message.channel.send(
        "⏸ I paused the music for you ! when you want me to resume it just let me know with **.resume** !"
      );
    } else {
      message.channel.send(
        "sorry but you need to be the person who requested the song or staff to pause this song !"
      );
    }
  }
  return message.channel.send(
    "how can i pause nothing ?? tell me to play something first !"
  );
};
