const Discord = require("discord.js");
const randColour = require("../../data/randomColor");
const musicDur = require("../../data/musicDuration");
const { Util } = require("discord.js");
const musicHelper = require("../../data/musicHelper");
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const youtube = new YouTube(`${process.env.YOUTUBE_KEY}`);
const snekfetch = require("snekfetch");
const queue = new Map();
const moment = require("moment");

exports.run = async (client, message, args) => {
  const searchString = args.slice(1).join(" ");
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";

  const voiceChannel = message.member.voiceChannel;
  if (!voiceChannel)
    return message.channel.send(
      "get in a voice channel if you want me to play you something !!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT")) {
    return message.channel.send(
      "sorry but i don't have permission to join your voice channel ! no super fun parties allowed there i guess !"
    );
  }
  if (!permissions.has("SPEAK")) {
    return message.channel.send(
      "help i don't have permission to speak in your voice channel !!"
    );
  }

  if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
    const playlist = await youtube.getPlaylist(url);
    const videos = await playlist.getVideos();
    for (const video of Object.values(videos)) {
      const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
      await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
    }
    return message.channel.send(
      `✅ Playlist: **${playlist.title}** has been added to the queue!`
    );
  } else {
    if (url.indexOf("youtu") > -1) {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        var videos = await youtube.searchVideos(searchString, 3);
        let index = 0;
        let embed = new Discord.RichEmbed()
          .setAuthor("Song selection", message.author.displayAvatarURL)
          .setColor(randColour())
          .setDescription(
            `Please tell me what number you want me to play !\n\n${videos
              .map(video2 => `**${++index} -** ${video2.title}`)
              .join("\n")}`
          )
          .setFooter(
            `${message.guild.name}`,
            "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
          )
          .setTimestamp();
        message.channel.send(embed);
        try {
          var response = await message.channel.awaitMessages(
            message2 => message2.content > 0 && message2.content < 4,
            {
              maxMatches: 1,
              time: 60000,
              errors: ["time"]
            }
          );
        } catch (err) {
          console.error(err);
          return message.channel.send(
            "make sure to tell me the number like **1** or **2** next time ! <:softheart:575053165804912652>"
          );
        }
        const videoIndex = parseInt(response.first().content);
        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
      } catch (err) {
        console.error(err);
        return message.channel.send(
          `sorry i looked super hard but i could not find anything for **${searchString}** !`
        );
      }
    }
    return handleVideo(video, message, voiceChannel);
  }

  async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    const song = {
      id: video.id,
      title: video.title, //Util.escapeMarkdown(video.title),
      url: `https://www.youtube.com/watch?v=${video.id}`,
      channel: video.channel.title,
      thumbnail: video.thumbnails.default.url,
      duration: musicDur.formatDuration(video.duration),
      requesterId: message.author.id,
      requesterUsername: message.author.username,
      totalSecondes: musicDur.getTotalSecondes(video.duration),
      dateAdded: moment(new Date())
    };
    if (!serverQueue) {
      const queueConstruct = {
        textChannel: msg.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };
      queue.set(msg.guild.id, queueConstruct);

      queueConstruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        queueConstruct.connection = connection;
        musicHelper.setMusicQueue(queue);
        play(msg.guild, queueConstruct.songs[0]);
      } catch (error) {
        console.error(
          `sorry but i could not join the voice channel ! ${error}`
        );
        queue.delete(msg.guild.id);
        return msg.channel.send(
          `sorry but i could not join the voice channel ! ${error}`
        );
      }
    } else {
      console.log("handleVideo", serverQueue.songs);
      serverQueue.songs.push(song);
      musicHelper.setMusicQueue(queue);
      console.log("handleVideo", serverQueue.songs);
      if (playlist) return undefined;
      else {
        const { body: buffer } = await snekfetch.get(song.thumbnail);
        let embed = new Discord.RichEmbed()
          .setAuthor("✅ Added to queue", message.author.displayAvatarURL)
          .setColor(randColour())
          .attachFiles([{ name: "thumbnail.jpg", attachment: buffer }])
          .setThumbnail("attachment://thumbnail.jpg")
          //   .setThumbnail(song.thumbnail)
          .setDescription(`**[► ${song.title}](${song.url})**`)
          .addField("Channel", `${song.channel}`, true)
          .addField("Duration", `${song.duration}`, true)
          .addField("Position in queue", serverQueue.songs.length, true)
          .setFooter(
            message.guild.name,
            "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
          )
          .setTimestamp();
        return msg.channel.send(embed);
      }
    }
    return undefined;
  }

  function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .playStream(ytdl(song.url))
      .on("end", reason => {
        if (reason === "Stream is not generating quickly enough.")
          console.log("Song ended.");
        else console.log(reason);

        serverQueue.songs.shift();
        serverQueue.songs[0].dateAdded = moment(new Date());
        musicHelper.setMusicQueue(queue);
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    serverQueue.textChannel.send(`🎶 I am now playing : **${song.title}**`);
  }
};
