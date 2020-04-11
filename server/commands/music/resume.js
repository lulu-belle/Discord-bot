const musicHelper = require("../../data/musicHelper");

exports.run = async (client, message, args) => {
  const serverQueue = musicHelper.musicQueue.get(message.guild.id);
  if (serverQueue && !serverQueue.playing) {
    if (
      message.member.hasPermission("MANAGE_MESSAGES") ||
      serverQueue.songs[0].requesterId === message.author.id
    ) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return message.channel.send(
        `▶ I resumed the music for you ! The current song is **${serverQueue.songs[0].title}**`
      );
    } else {
      return message.channel.send(
        "sorry but you need to be the person who requested the song or staff to resume this song !"
      );
    }
  }
  return message.channel.send(
    "What are you doing ?? there is nothing playing !"
  );
};
