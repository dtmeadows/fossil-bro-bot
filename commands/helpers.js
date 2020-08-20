// if you use a mention that has a nickname,
// discord adds an ! in the mention. Eg
// no nickname: <@180824755622903808>
// nickname:    <@!180824755622903808>
// we need to remove that otherwise nicknames will
// go under a separate entry in the database
function normalizeDiscordMention(mentionText) {
  if (mentionText.match(/^<@!\d+>/)) {
    return mentionText.replace('!', '');
  }
  return mentionText;
}

function extractKarmaRecipientAndReason(messageText) {
  const regex = /(?<recipient>\S+)\s*(?<reason>.*)?/;
  const regexpExtract = regex.exec(messageText);

  if (regexpExtract === null || messageText === undefined) {
    return null;
  }
  const { recipient, reason } = regexpExtract.groups;

  return {
    recipient: normalizeDiscordMention(recipient),
    reason,
  };
}

exports.extractKarmaRecipientAndReason = extractKarmaRecipientAndReason;
exports.normalizeDiscordMention = normalizeDiscordMention;
