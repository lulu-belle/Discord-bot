exports.run = (client, message) => {
  if (message.author.id === "157673412561469440") {
    message.channel.send("ping ??");
  } else {
    if (message.channel.type === "text") {
      message.channel.send("it is .ping you weirdo !");
      message.channel.send("<:monoeil:658912400996827146>");
    }
  }
};
