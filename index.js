const Discord = require('discord.js');

const client = new Discord.Client();

const { handleMessageContent } = require('./handle_message_content.js');

client.once('ready', () => {
  console.log('Ready!');
});

async function getDisplayName(userId, message) {
  let guildMember = null;
  guildMember = message.guild.members.cache.get(userId);
  if (!guildMember) {
    guildMember = await message.guild.members.fetch(userId).catch(() => { });
  }

  let user = null;
  if (guildMember) {
    user = guildMember.user;
  } else {
    user = await message.mentions.users.get(userId);
  }

  // Prefer, in order:
  // 1. Per-server nickname
  // 2. Username (eg @username)
  // 3. Just the user ID
  let displayName = null;
  if (guildMember && guildMember.nickname) {
    displayName = guildMember.nickname;
  } if (user && user.username) {
    displayName = user.username;
  } else {
    displayName = userId;
  }
  return `\`@${displayName}\``;
}

// this takes any bot response and:
// -> takes any mention and re-formats it to be the same
//  content but wrapped in ``. This is to prevent the bot
//  notifying people repeatedly, since the syntax of
//  commands would do that already. This also makes it so
//  calling a command like stats doesn't notify 10 people
//  at once.
async function replaceMentions(response, message) {
  const regex = /<@!?(\d+)>/g;
  // these manual promise operations are necessary because
  // by default .replace() doesn't handle promises.
  // answer taken from https://stackoverflow.com/a/48032528
  const promises = [];
  response.replace(regex, async (_match, p1) => {
    const promise = getDisplayName(p1, message);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return response.replace(regex, () => data.shift());
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
      const formattedResponse = await replaceMentions(response, message);

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
