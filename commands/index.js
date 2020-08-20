const Discord = require('discord.js');
const upvote = require('./upvote.js');
const downvote = require('./downvote.js');
const ping = require('./ping.js');
const checkKarma = require('./check_karma.js');
const help = require('./help.js');
const karmaStats = require('./karma_stats.js')

const commands = new Discord.Collection();

commands.set(upvote.name, upvote);
commands.set(downvote.name, downvote);
commands.set(checkKarma.name, checkKarma);
commands.set(ping.name, ping);
commands.set(help.name, help);
commands.set(karmaStats.name, karmaStats);

exports.commands = commands;
