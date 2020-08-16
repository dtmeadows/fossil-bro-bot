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

  const response = await handleMessageContent(message.content);

  if (response !== undefined) {
    try {
      message.channel.send(response);
    } catch (error) {
      console.error(error);
    }
  }
}

client.on('message', (message) => {
  handleMessage(message);
});

console.log(process.env);

client.login(process.env.DISCORD_TOKEN);
