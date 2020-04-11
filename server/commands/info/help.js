const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  const embed = new Discord.RichEmbed()
    .setAuthor("Commands")
    .setColor("#202225")
    .setFooter(
      `Lulu Bot`,
      "https://cdn.discordapp.com/avatars/601825955572350976/67cca6c8e018ae7f447e6f0e41cbfd3c.png?size=2048"
    )
    .setTimestamp();
  if (message.member.hasPermission("BAN_MEMBERS")) {
    embed.setDescription(
      `**Mod**

.ban @user
.unban user_id
.kick @user
.purgebulk x (deletes x amt of msgs, x must be a number)
.remind #channel/@user xd msg (please use .remind help for more info)
.setblankavatar (toggles kicking new people without avatars)
.setjoinage (toggles kicking new people with young accounts)
.warn @user (give user a strike)
.warn remove @user (removes a strike)
.mute @user (mutes user)
.unmute @user (unmutes a user)
.addemote http://link.com emoteName (add an emote)
.setnickname @user nickname (changes users nickname)
      
**Info**

.help (this)
.userinfo - or - .userinfo @user (account info)
.serverinfo (server info)
.image query (image search)
.avatar - or - .avatar @user (your avatar or a users)
.channels (chart of amt of msgs in channels)
.chart (chart of member count)
.msgcount (chart of msgs over few days)
.msgtoday (total msgs sent in 24 hours)
.getroles @user (list user roles)
.memberlist (list all members by join date)
.msguser - or - .msguser @user (gets msg amt sent by you or user)
.see :emote: (the emote but bigger)
.points - or - .points @user (get your point count or users point count)
.pointlist (points leaderboard)

**Fun**

.react query - or - .react query @user (gif reaction)
.qotd (gets a random question)
.setnickname nickname (changes your nickname)
.poll (walks you through making a poll)
.fbi - or - .fbi @user (sends the fbi)
.imma (just disappointment)
.setcolour #hex-code - or - .setcolor #hex-code (change colour of custom role)
.setrolename name (change name of custom role)
.buy (buy custom role with points)

**Shipping**

.ship - or - .ship list (list current ships)
.ship @user (see if user is shipped)
.ship @user1 @user2 (ships the 2 users)
.ship leave/end/breakup (ends your current ship)`
    );
  } else {
    embed.setDescription(
      `**Info**

.help (this)
.userinfo - or - .userinfo @user (account info)
.serverinfo (server info)
.image query (image search)
.avatar - or - .avatar @user (your avatar or a users)
.channels (chart of amt of msgs in channels)
.chart (chart of member count)
.msgcount (chart of msgs over few days)
.msgtoday (total msgs sent in 24 hours)
.getroles @user (list user roles)
.memberlist (list all members by join date)
.msguser - or - .msguser @user (gets msg amt sent by you or user)
.see :emote: (the emote but bigger)
.points - or - .points @user (get your point count or users point count)
.pointlist (points leaderboard)

**Fun**

.react query - or - .react query @user (gif reaction)
.qotd (gets a random question)
.setnickname nickname (changes your nickname)
.poll (walks you through making a poll)
.fbi - or - .fbi @user (sends the fbi)
.imma (just disappointment)
.setcolour #hex-code - or - .setcolor #hex-code (change colour of custom role)
.setrolename name (change name of custom role)
.buy (buy custom role with points)

**Shipping**

.ship - or - .ship list (list current ships)
.ship @user (see if user is shipped)
.ship @user1 @user2 (ships the 2 users)
.ship leave/end/breakup (ends your current ship)`
    );
  }
  message.author.send(embed).then(() => {
    message.delete(250);
  });
};
