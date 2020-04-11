const { request } = require("graphql-request");

exports.run = async (client, message, args) => {
  if (message.author.id == "157673412561469440") {
    let url = "";

    let query = `query {
                getDefaults{
                    guild_id channel_id mod_channel_id
                }
            }`;
    try {
      let res = await request(url, query);

      let guild_id = res.getDefaults[0].guild_id;
      let channel_id = res.getDefaults[0].channel_id;
      let mod_channel_id = res.getDefaults[0].mod_channel_id;

      if (args[1] === "guild" && args[2]) {
        if (args[2].replace(/([A-Za-z])/g).length === 18) {
          let query = `mutation{
                setDefault(guild_id: "${args[2]}",
          channel_id: "${channel_id}",
          mod_channel_id: "${mod_channel_id}", user_id: "${
            message.author.id
          }") {
                    guild_id channel_id mod_channel_id
                }
            }`;
          try {
            await request(url, query);
            message.channel.send(`Changed default guild to ${args[2]}`);
          } catch (err) {
            console.error(err);
          }
        }
      } else if (args[1] === "mod" && args[2]) {
        if (args[2].replace(/([A-Za-z])/g).length === 18) {
          let query = `mutation{
                setDefault(guild_id: "${guild_id}",
          channel_id: "${channel_id}",
          mod_channel_id: "${args[2]}", user_id: "${message.author.id}") {
                    guild_id channel_id mod_channel_id
                }
            }`;
          try {
            await request(url, query);
            message.channel.send(`Changed default mod channel to ${args[2]}`);
          } catch (err) {
            console.error(err);
          }
        }
      } else if (args[1].replace(/([A-Za-z])/g).length === 18) {
        let query = `mutation{
                setDefault(guild_id: "${guild_id}",
          channel_id: "${args[1]}",
          mod_channel_id: "${mod_channel_id}", user_id: "${
          message.author.id
        }") {
                    guild_id channel_id mod_channel_id
                }
            }`;
        try {
          await request(url, query);
          message.channel.send(`Changed default channel to ${args[1]}`);
        } catch (err) {
          console.error(err);
        }
      } else {
        message.channel.send("You did not do this right !");
        message.channel.send("<a:02upset:538273249306345476>");
      }
      setTimeout(() => {
        message.delete();
      }, 200);
    } catch (err) {
      console.error(err);
    }
  }
};
