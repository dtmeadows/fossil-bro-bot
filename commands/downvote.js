module.exports = {
  name: '--',
  description: 'Downvote something',
  execute(message, args) {
    const karma_recipient = args.shift();
    const karma_reason = args.shift();
    message.channel.send(`-- ${karma_recipient} ${karma_reason} (now at XX)`);
  },
};