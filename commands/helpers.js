function extractKarmaRecipientAndReason(messageText) {
  const regex = /(?<recipient>\S+)\s*(?<reason>.*)?/;
  const regexpExtract = regex.exec(messageText);

  if (regexpExtract === null || messageText === undefined) {
    return null;
  }
  return regexpExtract.groups;

  // let normalizedRecipient = null;
  // if (recipient.match(/^<@!\d+>/)) {
  //   normalizedRecipient = recipient.replace('!', '');
  // } else {
  //   normalizedRecipient = recipient;
  // }
}

exports.extractKarmaRecipientAndReason = extractKarmaRecipientAndReason;
