const { request } = require("graphql-request");

exports.run = async (client, message, args) => {
  let s = await client.guilds.get("559560674246787087");

  if (s.members.has(message.author.id)) {
    let mem = await s.fetchMember(message.author.id);
    if (mem._roles.includes("676621473196277768")) {
      message.channel
        .send(
          `Congrats on Winning again !!\nwhat would you like the name of your custom role to be ?`
        )
        .then(() => {
          message.channel
            .awaitMessages(res => res.author.id === message.author.id, {
              maxMatches: 1,
              time: 180000,
              errors: ["time"]
            })
            .then(async collected => {
              let roleName = collected.first().content.trim();
              message.channel
                .send(
                  `okay you want the role to be named **${roleName}** !\nwhat colour would you like it ? please use a hex code value like #fdd1ff !!`
                )
                .then(async () => {
                  message.channel
                    .awaitMessages(res => res.author.id === message.author.id, {
                      maxMatches: 1,
                      time: 180000,
                      errors: ["time"]
                    })
                    .then(async collected => {
                      let roleColor = collected.first().content.trim();
                      s.createRole({
                        name: `${roleName}`,
                        color: `${roleColor}`,
                        hoist: true,
                        position: 81
                      }).then(async role => {
                        await mem.addRole(role.id).catch(err => {
                          console.error(err);
                        });
                        await message.channel
                          .send(
                            `okay i gave you the role !\n\nsome useful commands\n**.setcolour #hex-code** - will change the colour of this role\n**.setrolename name** - will change the name of this role`
                          )
                          .catch(err => {
                            console.error(err);
                          });

                        let url = "";
                        let query = `mutation{
                        setCustomRole(guild_id: "${s.id}", user_id: "${message.author.id}", custom_role: "${role.id}") {
                            guild_id user_id
                        }
                        }`;
                        try {
                          await request(url, query);
                          let memRoles = [];
                          await Promise.all(
                            mem.roles.map(r => {
                              if (r.id !== "676621473196277768") {
                                memRoles.push(r.id);
                              }
                            })
                          );
                          mem.setRoles(memRoles).catch(err => {
                            console.error(err);
                          });
                        } catch (err) {
                          message.channel
                            .send(
                              "sorry i was not able to ! make sure to let <@157673412561469440> know !"
                            )
                            .catch(err => {
                              console.error(err);
                            });
                          console.error(err);
                        }
                      });
                    })
                    .catch(err => {
                      console.error(err);
                      message.channel
                        .send(
                          "sorry but i timed out ! figure out both the colour and the name and i will be here to try again ! <:softheart:575053165804912652>"
                        )
                        .catch(err => {
                          console.error(err);
                        });
                    });
                });
            })
            .catch(err => {
              console.error(err);
              message.channel
                .send(
                  "sorry but i timed out ! figure out both the colour and the name and i will be here to try again ! <:softheart:575053165804912652>"
                )
                .catch(err => {
                  console.error(err);
                });
            });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
