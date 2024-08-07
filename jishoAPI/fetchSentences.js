// For okurigana words, truncate the word and reading to match, get the first one for kanji-kana-kanji-kana words i cant be bothered
const truncateMatchingCharacters = (word, reading) => {
  for (let i = 0; i < word.length; i++) {
    for (let j = i; j < reading.length; j++) {
      if (word[i] === reading[j]) {
        return [word.slice(0, i), reading.slice(0, j)];
      }
    }
  }
  return [word, reading];
};

/*
    Use sentence transcriptions to filter out sentences that don't match the reading
  */
const matchReadingSentences = (sentences, word, reading) => {
  // filter out sentences that don't contain the word
  sentences = sentences.filter((sentence) => sentence.text.includes(word));

  if (reading === undefined) return sentences;
  if (reading === word) return sentences;

  [word, reading] = truncateMatchingCharacters(word, reading);
  console.log(`Truncated to ${word} (${reading})`);

  return sentences.filter((sentence) => {
    const transcription = sentence.transcriptions[0].text;
    const regex = /\[(.*?)\]/g;
    const matches = transcription.match(regex);
    if (matches == null) return false;

    // [[kanji, kana, kana, ...], [kanji, kana, ...], ...]
    // assuming the format is whole kanji word, with kana readings of each kanji
    const words = matches.map((match) => match.slice(1, -1).split("|"));
    return words.some((wordArray) => {
      const wordStartIndex = wordArray[0].indexOf(word[0]);
      if (wordStartIndex === -1) return false;

      // try to match the kanjis in wordArray[0] to the kanas in wordArray
      return (
        wordArray
          .slice(wordStartIndex + 1, word.length + wordStartIndex + 1)
          .join("") === reading
      );
    });
  });
};

const isVerb = (jishoResult) => {
  const pos = jishoResult.partsOfSpeech.map((entry) => entry.toLowerCase());
  if (pos.includes("suru verb")) return false;
  return pos.some(
    (part) =>
      !part.includes("suru") &&
      !part.includes("adverb") &&
      part.includes("verb")
  );
};

const getTatoebaSentences = async (jishoResult, pageNo = 1) => {
  word = jishoResult.word;
  reading = jishoResult.reading;

  if (pageNo > 3) return [];

  if (isVerb(jishoResult)) {
    [word, reading] = [word.slice(0, -1), reading.slice(0, -1)];
  }
  console.log(`Getting sentences for ${word} (${reading}) on page ${pageNo}`);

  const result = await fetch(
    `https://tatoeba.org/en/api_v0/search?from=jpn&query=${word}&to=eng&page=${pageNo}`
  );

  if (!result.ok) return [];

  const data = (await result.json()).results;
  const numSentences = 5;

  if (data.length === 0) return [];

  const sentences = matchReadingSentences(data, word, reading)
    .slice(0, numSentences)
    .map((sentence) => {
      try {
        return {
          japanese: sentence.text,
          english: sentence.translations[0][0].text,
        };
      } catch (error) {
        return null;
      }
    })
    .filter((sentence) => sentence !== null);

  if (sentences.length === 0) {
    return getTatoebaSentences(jishoResult, pageNo + 1);
  }

  return sentences;
};

module.exports = { getTatoebaSentences };
