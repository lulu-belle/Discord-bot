const clean = require("../../data/evalHelper");

exports.run = async (client, message, args) => {
  if (
    message.author.id == "157673412561469440" ||
    message.author.id == "630573404352937996"
  ) {
    try {
      args.shift();
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {
        code: "xl"
      });
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
};
