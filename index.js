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
async function formatResponse(response, guild) {
  const mentionRegex = /<@!?(?<userId>\d+)>/g;
  const extract = Array.from(response.matchAll(mentionRegex));

  let formattedResponse = null;
  if (extract && extract.length > 0) {
    formattedResponse = response;
    extract.forEach((ex) => {
      const { userId } = ex.groups;

      const guildMember = guild.members.cache.get(userId);
      const { user } = guildMember;

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

  const formattedResponse = await formatResponse(response, message.guild);

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
