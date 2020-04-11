const { request } = require("graphql-request");

exports.run = async (client, message, args) => {
  let s = await client.guilds.get("559560674246787087");

  if (s.members.has(message.author.id)) {
    let url = "";
    let query = `{
                getUser(guild_id: "${s.id}", user_id: "${message.author.id}") {
                    guild_id user_id booster_role custom_role temp_role
                }
            }`;
    try {
      user = await request(url, query);

      let str = `What role do you want to change the colour of ? please type the number before the role  like 1 - or - 2\n`;
      let i = 1;
      let roleArray = [];
      if (
        "booster_role" in user.getUser &&
        user.getUser.booster_role &&
        user.getUser.booster_role.length > 0
      ) {
        let role = await s.roles.get(user.getUser.booster_role);
        str += `\n${i} : ${role}`;
        i++;
        let obj = {
          type: "booster",
          id: i,
          role: role
        };
        roleArray.push(obj);
      }
      if (
        "custom_role" in user.getUser &&
        user.getUser.custom_role &&
        user.getUser.custom_role.length > 0
      ) {
        let role = await s.roles.get(user.getUser.custom_role);
        str += `\n${i} : ${role}`;
        i++;
        let obj = {
          type: "custom",
          id: i,
          role: role
        };
        roleArray.push(obj);
      }
      if (
        "temp_role" in user.getUser &&
        user.getUser.temp_role &&
        user.getUser.temp_role.length > 0
      ) {
        let role = await s.roles.get(user.getUser.temp_role);
        str += `\n${i} : ${role}`;
        i++;
        let obj = {
          type: "temp",
          id: i,
          role: role
        };
        roleArray.push(obj);
      }
      if (i === 1) {
        return message.channel.send("you do not have any custom roles !");
      } else {
        if (i === 2) {
          roleArray[0].role
            .setColor(args[1].trim())
            .then(() => {
              message.channel.send(`okay i changed the color of the role !!`);
            })
            .catch(err => {
              console.error(err);
            });
        } else {
          message.channel
            .send(str)
            .then(m => {
              message.channel
                .awaitMessages(res => res.author.id === message.author.id, {
                  maxMatches: 1,
                  time: 120000,
                  errors: ["time"]
                })
                .then(async collected => {
                  let index = Number(collected.first().content.trim()) - 1;

                  roleArray[index].role.setColor(args[1].trim()).then(() => {
                    message.channel.send("okay i did it !");
                  });
                })
                .catch(err => {
                  console.error(err);
                });
            })
            .catch(err => {
              console.error(err);
            });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
};
