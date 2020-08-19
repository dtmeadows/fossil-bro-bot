function extractKarmaRecipientAndReason(messageText) {
  const regex = /(?<recipient>\S+)\s*(?<reason>.*)?/;
  const regexpExtract = regex.exec(messageText);

  if (regexpExtract === null || messageText === undefined) {
    throw new Error('Error! Invalid format for ++ command. You must specify a recipient after ++');
  }
  return regexpExtract.groups;
}

exports.extractKarmaRecipientAndReason = extractKarmaRecipientAndReason;
