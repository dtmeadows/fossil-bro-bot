const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const { prefix, token } = require('./config.json');

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {
  // trim leading whitespace and check for prefix
  const trimmed_message = message.content.trimLeft();
  if (!trimmed_message.startsWith(prefix) || message.author.bot) {
    // not a message that we care about
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  }
  catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(token);
