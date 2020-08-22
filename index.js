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

  console.log(extract);
  console.log(extract && extract.length > 0);

  let formattedResponse = null;
  if (extract && extract.length > 0) {
    formattedResponse = response;
    extract.forEach(async (ex) => {
      const { userId } = ex.groups;

      let guildMember = null;
      guildMember = message.guild.members.cache.get(userId);
      if (!guildMember) {
        guildMember = await message.guild.members.fetch(userId);
      }

      console.log(`user id ${userId}`);
      console.log(guildMember);

      let user = null;
      if (guildMember) {
        user = guildMember.user;
      } else {
        user = message.mentions.users.get(userId);
      }

      console.log(`${user}: user`);

      formattedResponse = formattedResponse.replace(`<@${userId}>`, `\`@${guildMember.nickname || user.username}\``);
      formattedResponse = formattedResponse.replace(`<@! ${userId}>`, `\`@${guildMember.nickname || user.username}\``);
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

  const response = await handleMessageContent(message.content, message.guild.id, message.author.id);

  const formattedResponse = await formatResponse(response, message);

  if (formattedResponse !== undefined) {
    try {
      message.channel.send(formattedResponse);
    } catch (error) {
      console.error(error);
    }
  }
}

client.on('message', (message) => {
  handleMessage(message);
});

client.login(process.env.discord_token);
