exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("KICK_MEMBERS")) {
    message.channel.send(
      `How dare you ${message.author.username} !! You don't have the permissions to use this command !`
    );
    message.channel.send("<:natsukiMad:646210751417286656>");
  } else {
    if (!args[1]) {
      message.channel.send("there's no user specified!!!");
      message.channel.send("<:natsukiMad:646210751417286656>");
    } else {
      message.guild.unban(args[1]).then(user => {
        message.channel.send(`unbanned ${user.username} !`);
      });
    }
  }
};
