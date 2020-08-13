module.exports = {
  name: 'ping',
  description: 'Ping!',
  execute(message, _args) {
    message.channel.send('Pong.');
  },
};