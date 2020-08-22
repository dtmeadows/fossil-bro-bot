const Discord = require('discord.js');

const client = new Discord.Client();

const { handleMessageContent } = require('./handle_message_content.js');

client.once('ready', () => {
  console.log('Ready!');
});

async function handleMessage(message) {
  if (message.author.bot) {
    // not a message that we care about
    return;
  }

  const response = await handleMessageContent(message.content, message.guild.id, message.author.id);

  console.log(`raw response: ${response}`);
  const mentionRegex = /<@!?(?<userId>\d+)>/g;
  const extract = Array.from(response.matchAll(mentionRegex));

  console.log(extract);

  let formattedResponse = null;
  if (extract && extract.length > 0) {
    formattedResponse = response;
    extract.forEach((ex) => {
      const { userId } = ex.groups;

      console.log(`found user id: ${userId}`);

      const guildMember = message.guild.members.cache.get(userId);
      const { user } = guildMember;

      formattedResponse = formattedResponse.replace(`<@${userId}>`, `\`@${guildMember.nickname || user.username}\``);
      formattedResponse = formattedResponse.replace(`<@!${userId}>`, `\`@${guildMember.nickname || user.username}\``);
    });
  } else {
    formattedResponse = response;
  }

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
