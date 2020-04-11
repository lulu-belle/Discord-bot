const Discord = require("discord.js");
const randomColor = require("../data/randomColor");
const reactionRoleHelper = require("../data/reactionRoleHelper");

module.exports = async (client, messageReaction, user) => {
  for (let i in reactionRoleHelper.reactionRoleList) {
    let emoteName = reactionRoleHelper.reactionRoleList[i].emote;
    if (emoteName.indexOf("<") > -1) {
      emoteName = emoteName.split(":")[1];
    }
    if (
      messageReaction._emoji.name === emoteName &&
      messageReaction.message.id ===
        reactionRoleHelper.reactionRoleList[i].message_id
    ) {
      await removeRole(reactionRoleHelper.reactionRoleList[i].role_id);
    }
  }

  if (messageReaction._emoji.name === "⭐") {
    let starChannel = messageReaction.message.channel.guild.channels.find(
      channel => channel.name === "⭐memories"
    );
    if (!starChannel) {
      starChannel = messageReaction.message.channel.guild.channels.find(
        channel => channel.name === "memories"
      );
      if (!starChannel) {
        return messageReaction.message.channel.send(
          `you do not have a starboard channel ! please make a channel and name it exactly « ⭐memories » ou « memories »`
        );
      }
    }

    const fetch = await starChannel.fetchMessages({ limit: 100 });
    const stars = fetch.find(
      m =>
        m.embeds[0].footer.text.startsWith("⭐") &&
        m.embeds[0].footer.text.endsWith(messageReaction.message.id)
    );
    if (stars) {
      const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(
        stars.embeds[0].footer.text
      );
      const foundStar = stars.embeds[0];
      const image =
        messageReaction.message.attachments.array().length > 0 &&
        messageReaction.message.attachments.array()[0].filesize > 0
          ? await extension(
              messageReaction,
              messageReaction.message.attachments.array()[0].url
            )
          : "";
      const embed = new Discord.RichEmbed()
        .setColor(foundStar.color)
        .setDescription(foundStar.description)
        .setAuthor(
          `${messageReaction.message.author.username} (${messageReaction.message.channel.name})`,
          messageReaction.message.author.displayAvatarURL
        )
        .setTimestamp()
        .setFooter(
          `⭐ ${parseInt(star[1]) - 1} | ${messageReaction.message.id}`
        )
        .setImage(image);
      const starMsg = await starChannel.fetchMessage(stars.id);
      await starMsg.edit({ embed });
      if (parseInt(star[1]) - 1 <= 3) return starMsg.delete(250);
    }
  } else if (messageReaction.message.id === "663887669939535903") {
    if (messageReaction._emoji.name === "1️⃣") {
      removeRole("561441866525048842");
    } else if (messageReaction._emoji.name === "2️⃣") {
      removeRole("561441985236434945");
    } else if (messageReaction._emoji.name === "3️⃣") {
      removeRole("561442059567890442");
    } else if (messageReaction._emoji.name === "4️⃣") {
      removeRole("561442124592054292");
    } else if (messageReaction._emoji.name === "5️⃣") {
      removeRole("561442214572589077");
    }
  } else if (messageReaction.message.id === "663887880153989181") {
    if (messageReaction._emoji.name === "❤️") {
      removeRole("663686604904464384");
    } else if (messageReaction._emoji.name === "💙") {
      removeRole("663686449303912468");
    } else if (messageReaction._emoji.name === "trans") {
      removeRole("663686632548859914");
    } else if (messageReaction._emoji.name === "nonbinary") {
      removeRole("663686679466606592");
    } else if (messageReaction._emoji.name === "cory") {
      removeRole("663864213373976589");
    } else if (messageReaction._emoji.name === "🍓") {
      removeRole("663864211667025962");
    }
  } else if (messageReaction.message.id === "663888106998464544") {
    if (messageReaction._emoji.name === "🤐") {
      removeRole("561443343842934806");
    } else if (messageReaction._emoji.name === "🥳") {
      removeRole("561443427107995660");
    } else if (messageReaction._emoji.name === "😜") {
      removeRole("561443500491800578");
    }
  } else if (messageReaction.message.id === "663888254017470483") {
    if (messageReaction._emoji.name === "🅿") {
      removeRole("561443526617989129");
    } else if (messageReaction._emoji.name === "❎") {
      removeRole("561443723330846722");
    } else if (messageReaction._emoji.name === "🍄") {
      removeRole("561443758487371776");
    } else if (messageReaction._emoji.name === "🖥") {
      removeRole("561443809712537625");
    } else if (messageReaction._emoji.name === "📱") {
      removeRole("561443842688155658");
    }
  } else if (messageReaction.message.id === "663888532959657988") {
    if (messageReaction._emoji.name === "💁‍♀️") {
      removeRole("561444125476651009");
    } else if (messageReaction._emoji.name === "❤") {
      removeRole("561444242778750978");
    } else if (messageReaction._emoji.name === "🙊") {
      removeRole("561444283400454146");
    }
  } else if (messageReaction.message.id === "663888692573765634") {
    if (messageReaction._emoji.name === "✅") {
      removeRole("561443898266746893");
    } else if (messageReaction._emoji.name === "❌") {
      removeRole("561444015472377876");
    } else if (messageReaction._emoji.name === "❓") {
      removeRole("561444049828184074");
    }
  } else if (messageReaction.message.id === "663888853203157004") {
    if (messageReaction._emoji.name === "🍲") {
      removeRole("561442784272318485");
    } else if (messageReaction._emoji.name === "🐕") {
      removeRole("561442865457135626");
    } else if (messageReaction._emoji.name === "🌄") {
      removeRole("561442912211042309");
    } else if (messageReaction._emoji.name === "⚽") {
      removeRole("561442956532514826");
    } else if (messageReaction._emoji.name === "🎵") {
      removeRole("561443003617509396");
    } else if (messageReaction._emoji.name === "🚗") {
      removeRole("561443031983587331");
    } else if (messageReaction._emoji.name === "📚") {
      removeRole("561443068927148034");
    } else if (messageReaction._emoji.name === "📺") {
      removeRole("561443115869798423");
    } else if (messageReaction._emoji.name === "💻") {
      removeRole("561443156642627611");
    } else if (messageReaction._emoji.name === "🌺") {
      removeRole("561443189123448842");
    } else if (messageReaction._emoji.name === "🖌️") {
      removeRole("561443216528769024");
    } else if (messageReaction._emoji.name === "🎮") {
      removeRole("561443255821271040");
    } else if (messageReaction._emoji.name === "👗") {
      removeRole("561443309667745805");
    }
  } else if (messageReaction.message.id === "663889028315217935") {
    if (messageReaction._emoji.name === "🎙️") {
      removeRole("663148896046022707");
    } else if (messageReaction._emoji.name === "👋") {
      removeRole("672789435875590144");
    }
  }
  //----------------------------- losers club below
  else if (messageReaction.message.id === "664779018481958943") {
    if (messageReaction._emoji.name === "1️⃣") {
      removeRole("664369050180386816");
    } else if (messageReaction._emoji.name === "2️⃣") {
      removeRole("664369352908341258");
    } else if (messageReaction._emoji.name === "3️⃣") {
      removeRole("664369247660670986");
    } else if (messageReaction._emoji.name === "4️⃣") {
      removeRole("664369323170856980");
    }
  } else if (messageReaction.message.id === "664779140892983316") {
    if (messageReaction._emoji.name === "❤️") {
      removeRole("664368375669063690");
    } else if (messageReaction._emoji.name === "💙") {
      removeRole("664368512042795037");
    } else if (messageReaction._emoji.name === "trans") {
      removeRole("664368600446009344");
    } else if (messageReaction._emoji.name === "nonbinary") {
      removeRole("664368700673228800");
    }
  } else if (messageReaction.message.id === "664779339035836417") {
    if (messageReaction._emoji.name === "1️⃣") {
      removeRole("664374338950135829");
    } else if (messageReaction._emoji.name === "2️⃣") {
      removeRole("664374615979720704");
    } else if (messageReaction._emoji.name === "3️⃣") {
      removeRole("664374744816287764");
    } else if (messageReaction._emoji.name === "4️⃣") {
      removeRole("664374774939516928");
    } else if (messageReaction._emoji.name === "5️⃣") {
      removeRole("664374807353229313");
    } else if (messageReaction._emoji.name === "6️⃣") {
      removeRole("664374834591039488");
    } else if (messageReaction._emoji.name === "7️⃣") {
      removeRole("664374884666703882");
    }
  } else if (messageReaction.message.id === "664781016879333397") {
    if (messageReaction._emoji.name === "❤") {
      removeRole("664372807219675136");
    } else if (messageReaction._emoji.name === "💘") {
      removeRole("664372855668080642");
    } else if (messageReaction._emoji.name === "🖤") {
      removeRole("664374507904958515");
    }
  } else if (messageReaction.message.id === "664781128594620416") {
    if (messageReaction._emoji.name === "⭕") {
      removeRole("664372172856360980");
    } else if (messageReaction._emoji.name === "❌") {
      removeRole("664372471331291168");
    } else if (messageReaction._emoji.name === "🚫") {
      removeRole("664372530848727040");
    }
  } else if (messageReaction.message.id === "664781295624126484") {
    if (messageReaction._emoji.name === "💢") {
      removeRole("664370131941720064");
    } else if (messageReaction._emoji.name === "📚") {
      removeRole("664370960668950529");
    } else if (messageReaction._emoji.name === "🐶") {
      removeRole("664370501489262609");
    } else if (messageReaction._emoji.name === "🎨") {
      removeRole("664371305445064705");
    } else if (messageReaction._emoji.name === "🎥") {
      removeRole("664371984272064514");
    } else if (messageReaction._emoji.name === "💪") {
      removeRole("664370804305166347");
    } else if (messageReaction._emoji.name === "🎮") {
      removeRole("664370890737319950");
    } else if (messageReaction._emoji.name === "💤") {
      removeRole("664371616754565120");
    } else if (messageReaction._emoji.name === "👀") {
      removeRole("664371158304686080");
    } else if (messageReaction._emoji.name === "🎵") {
      removeRole("664371041635663902");
    } else if (messageReaction._emoji.name === "🌺") {
      removeRole("664370715813740554");
    } else if (messageReaction._emoji.name === "💾") {
      removeRole("664370841173229579");
    }
  } else if (messageReaction.message.id === "664781416764014604") {
    if (messageReaction._emoji.name === "🎙️") {
      removeRole("664372929982627850");
    } else if (messageReaction._emoji.name === "👋") {
      removeRole("681781904051273740");
    }
  } else if (messageReaction.message.id === "664781943019143172") {
    if (messageReaction._emoji.name === "🔞") {
      removeRole("664392387367272460");
    }
  }

  function extension(messageReaction, attachment) {
    const imageLink = attachment.split(".");
    const typeOfImage = imageLink[imageLink.length - 1];
    const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
    if (!image) return "";
    return attachment;
  }

  async function removeRole(role) {
    let memberRolesIdArray = [];
    let mem = await messageReaction.message.guild.fetchMember(user.id);
    if (mem) {
      mem.roles.map(r => {
        memberRolesIdArray.push(r.id);
      });
      for (let i = 0; i < memberRolesIdArray.length; i++) {
        if (memberRolesIdArray[i] === role) {
          memberRolesIdArray.splice(i, 1);
        }
      }
      mem.setRoles(memberRolesIdArray);
    }
  }
};
