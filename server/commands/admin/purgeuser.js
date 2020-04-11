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
      let mem = null;
      if (message.mentions.members.first()) {
        mem = message.mentions.members.first().user.id;
      } else if (args[1].replace(/([^0-9])/g, "") >= 18) {
        mem = args[1].replace(/([^0-9])/g, "");
      }
      if (mem) {
        if (
          mem === "601825955572350976" &&
          message.author.id !== "157673412561469440" &&
          message.author.id !== "630573404352937996"
        ) {
          message.channel.send("i am not deleting my own message dummy ");
          return message.channel.send("<:natsukiJoy:646210607166652430>");
        } else {
          let limit = 100;
          if (args[2]) {
            limit = Number(args[2]);
            if (typeof limit !== "number") {
              limit = 100;
            }
          }
          message.channel
            .fetchMessages({ limit: limit })
            .then(messages => {
              let msgs = [];
              messages
                .filter(m => m.author.id === mem)
                .map(m => msgs.push(m.id));
              message.channel
                .bulkDelete(msgs)
                .then(() => message.channel.send("all done !"))
                .catch(err => {
                  message.channel.send("sorry i was not able to !!");
                  console.error(err);
                });
            })
            .catch(err => {
              message.channel.send("sorry i was not able to !!");
              console.error(err);
            });
        }
      } else {
        message.channel.send(
          "sorry but i dont know whose messages you are trying to delete !"
        );
        return message.channel.send("<:confusedKanna:665372884402962432>");
      }
    }
  }
};
