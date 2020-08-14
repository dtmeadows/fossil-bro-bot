const Discord = require('discord.js');

const client = new Discord.Client();

const { token } = require('./config.json');
const { handleMessageContent } = require('./handle_message_content.js');

client.once('ready', () => {
  console.log('Ready!');
});

function handleMessage(message) {
  if (message.author.bot) {
    // not a message that we care about
    return;
  }

  const response = handleMessageContent(message.content);

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

client.login(token);
