const musicHelper = require("../../data/musicHelper");

exports.run = async (client, message, args) => {
  const serverQueue = musicHelper.musicQueue.get(message.guild.id);
  if (!message.member.voiceChannel)
    return message.channel.send("please get in a voice channel first !!");
  if (!serverQueue || serverQueue.songs.length === 0)
    return message.channel.send(
      "there is nothing to skip ! how about you tell me to play something first !"
    );
  if (
    message.member.hasPermission("MANAGE_MESSAGES") ||
    serverQueue.songs[0].requesterId === message.author.id
  ) {
    serverQueue.connection.dispatcher.end("Skip command has been used!");
  } else {
    message.channel.send(
      "sorry but you need to be the person who requested the song or staff to skip songs !"
    );
  }

  return;
};
