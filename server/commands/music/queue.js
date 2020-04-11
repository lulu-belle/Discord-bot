const Discord = require("discord.js");
const musicHelper = require("../../data/musicHelper");
const randColour = require("../../data/randomColor");
const snekfetch = require("snekfetch");
const moment = require("moment");

exports.run = async (client, message, args) => {
  const serverQueue = musicHelper.musicQueue.get(message.guild.id);
  if (!serverQueue) return message.channel.send("There is nothing playing.");
  let songArray = serverQueue.songs;
  let nowPlaying = serverQueue.songs[0];
  const { body: buffer } = await snekfetch.get(nowPlaying.thumbnail);

  let timeDiff = moment(new Date()).diff(
    nowPlaying.dateAdded,
    "seconds",
    false
  );
  let percentageOfSong = Math.floor((timeDiff / nowPlaying.totalSecondes) * 15);

  let trackPosition = "";
  for (let i = 0; i < percentageOfSong; i++) {
    trackPosition += `─`;
  }
  trackPosition += "⦿";
  for (let i = 15; i > percentageOfSong; i--) {
    trackPosition += `─`;
  }

  let songList = "";
  let totalTime = nowPlaying.totalSecondes - timeDiff;
  if (songArray.length > 0) {
    await Promise.all(
      songArray.map((song, i) => {
        if (i !== 0) {
          songList += `**${i + 1}** - [${song.title}](${song.url}) | ${
            song.duration
          } Requested by: ${song.requesterUsername}\n`;
          totalTime += song.totalSecondes;
        }
      })
    );
  }

  let formatTimeStr = "";

  if (totalTime >= 60) {
    let sec = totalTime % 60;
    let min = Math.floor(totalTime / 60);
    let hour = null;
    if (min >= 60) {
      hour = Math.floor(min / 60);
      min = min % 60;
    }

    if (hour) {
      if (hour < 10) formatTimeStr += `0${hour}:`;
      else formatTimeStr += `${hour}:`;
    }
    if (min < 10) formatTimeStr += `0${min}:`;
    else formatTimeStr += `${min}:`;
    if (sec < 10) formatTimeStr += `0${sec}`;
    else formatTimeStr += `${sec}`;
  }

  let embed = new Discord.RichEmbed()
    .setColor(randColour())
    .attachFiles([{ name: "thumbnail.jpg", attachment: buffer }])
    .setThumbnail("attachment://thumbnail.jpg")
    .setFooter(
      message.guild.name,
      "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
    )
    .setTimestamp();

  console.log(songArray);
  if (songArray.length > 1) {
    embed
      .setDescription(
        `**[► ${nowPlaying.title}](${nowPlaying.url})**\n|${trackPosition}|`
      )
      .addField(`Up next`, `${songList}\nTime Left : ${formatTimeStr}`);
  } else {
    embed
      .setDescription(
        `**[► ${nowPlaying.title}](${nowPlaying.url})**\n|${trackPosition}|`
      )
      .addField("Channel", `${nowPlaying.channel}`, true)
      .addField("Duration", `${nowPlaying.duration}`, true)
      .addField("Requested by", `${nowPlaying.requesterUsername}`, true)
      .addField("Time left", `${formatTimeStr}`, true);
  }
  if (message.guild && message.guild.icon !== null)
    embed.setAuthor("Song queue", message.guild.iconURL);
  else embed.setAuthor("📑 Song queue");
  return message.channel.send(embed);
};
