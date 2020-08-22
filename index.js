const Discord = require('discord.js');

const client = new Discord.Client();

const { handleMessageContent } = require('./handle_message_content.js');

client.once('ready', () => {
  console.log('Ready!');
});

// this takes any bot response and:
// -> takes any mention and re-formats it to be the same
//  content but wrapped in ``. This is to prevent the bot
//  notifying people repeatedly, since the syntax of
//  commands would do that already. This also makes it so
//  calling a command like stats doesn't notify 10 people
//  at once.
async function formatResponse(response, message) {
  const mentionRegex = /<@!?(?<userId>\d+)>/g;
  const extract = Array.from(response.matchAll(mentionRegex));

  let formattedResponse = null;
  if (extract && extract.length > 0) {
    formattedResponse = response;
    extract.forEach(async (ex) => {
      const { userId } = ex.groups;

      let guildMember = null;
      guildMember = message.guild.members.cache.get(userId);
      if (!guildMember) {
        guildMember = message.guild.members.fetch(userId).then((r) => r).catch(() => { });
      }

      let user = null;
      if (guildMember) {
        user = guildMember.user;
      } else {
        user = message.mentions.users.get(userId);
      }

      // Prefer, in order:
      // 1. Per-server nickname
      // 2. Username (eg @username)
      // 3. Just the user ID
      let displayName = null;
      if (guildMember && guildMember.nickname) {
        displayName = guildMember.nickname;
      } else if (user && user.username) {
        displayName = user.username;
      } else {
        displayName = userId;
      }

      formattedResponse = formattedResponse.replace(new RegExp(`<@!?${userId}>`), `\`@${displayName}\``);
    });
  } else {
    formattedResponse = response;
  }
  return formattedResponse;
}

async function handleMessage(message) {
  if (message.author.bot) {
    // not a message that we care about
    return;
  }

  try {
    const response = await handleMessageContent(
      message.content, message.guild.id, message.author.id,
    );

    if (response) {
      const formattedResponse = await formatResponse(response, message);

      console.log(`sending response: ${formattedResponse}`);
      message.channel.send(formattedResponse);
    }
  } catch (error) {
    message.channel.send("Error! There was a problem with that request. We'll look into it!");
    console.log(error);
  }
}

client.on('message', (message) => {
  handleMessage(message);
});

client.login(process.env.discord_token);
