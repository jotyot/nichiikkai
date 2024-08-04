require('dotenv').config()
const wanikaniAPIkey = process.env.WANIKANI_API_KEY

/*
  The VocabInfo object has the following properties:
  word: string
  reading: string[]
  meaning: string[]
  partsOfSpeech: string[]
  sentences: {japanese: string, english: string}[]
*/

/*
  If word is found, returns a VocabInfo object
  Else returns null
  Wanikani never has multiple of the same vocab word, so return null if first match doesn't match reading
*/
const getWanikaniVocab = async (word, reading) => {
  word = word.replace(/(~|～)/g, "〜");

  const response = await fetch(
    `https://api.wanikani.com/v2/subjects?types=vocabulary&slugs=${word}`,
    {
      headers: {
        Authorization: `Bearer ${wanikaniAPIkey}`,
      },
    }
  );
  const data = (await response.json()).data;
  try {
    const firstResult = data[0].data;
    const vocabObject = {
      word: firstResult.characters,
      reading: firstResult.readings
        .filter((reading) => reading.accepted_answer)
        .map((reading) => reading.reading),
      meaning: firstResult.meanings.map((meaning) => meaning.meaning),
      partsOfSpeech: firstResult.parts_of_speech,
      sentences: firstResult.context_sentences.map((sentence) => ({
        japanese: sentence.ja,
        english: sentence.en,
      })),
    };

    if (reading && !vocabObject.reading.includes(reading)) {
      throw new Error("Reading doesn't match");
    }

    return vocabObject;
  } catch (error) {
    return null;
  }
};

const getReadingsFromJishoEntry = (entry, targetWord) => {
  // japanese: [{word: kanji, reading: kana}]
  const readingFilter = (japanese) => {
    return japanese.word === targetWord || japanese.word === undefined;
  };

  const readingMatch = entry.japanese
    .filter(readingFilter)
    .map((japanese) => japanese.reading);

  if (readingMatch.length === 0) {
    targetWord = entry.japanese[0].word ?? entry.slug;
    return getReadingsFromJishoEntry(entry, targetWord);
  }

  return readingMatch;
};

const kanaOnlyWordFilter = (word) => (entry) =>
  entry.japanese.some(
    (japanese) => japanese.reading === word && japanese.word === undefined
  );

const getJishoVocab = async (word, reading) => {
  word = word.replace(/(~|～|〜)/g, "");

  const result = await fetch(
    `https://jisho.org/api/v1/search/words?keyword=${word}`
  );
  const data = (await result.json()).data;

  const firstResult =
    data.find(kanaOnlyWordFilter(word)) ??
    data.find((entry) => {
      const readings = getReadingsFromJishoEntry(entry, word);
      return readings.includes(reading) || readings.includes(word);
    }) ??
    data[0];

  const response = {
    word:
      firstResult.japanese.find((japanese) => japanese.word === word)?.word ?? // find the word with request kanji
      firstResult.japanese.find((japanese) => japanese.reading === word)
        ?.reading ?? // find word if it's a reading
      firstResult.japanese[0].word, // if no match, default to first word
    reading: getReadingsFromJishoEntry(firstResult, word),
    meaning: firstResult.senses[0].english_definitions,
    partsOfSpeech: firstResult.senses[0].parts_of_speech,
    sentences: [],
  };
  console.log(firstResult.slug);
  return response;
};

// For okurigana words, truncate the word and reading to match
function truncateMatchingCharacters(word, reading) {
  let i = word.length - 1;
  let j = reading.length - 1;

  while (i >= 0 && j >= 0 && word[i] === reading[j]) {
    i--;
    j--;
  }

  return [word.slice(0, i + 1), reading.slice(0, j + 1)];
}

/*
  Use sentence transcriptions to filter out sentences that don't match the reading
*/
const matchReadingSentences = (sentences, word, reading) => {
  sentences = sentences.filter((sentence) =>
    sentence.text.includes(word.slice(0, -1))
  );

  if (reading === undefined) return sentences;
  if (reading === word) return sentences;

  [word, reading] = truncateMatchingCharacters(word, reading);

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

const getTatoebaSentences = async (word, reading, pageNo = 1) => {
  if (pageNo > 3) return [];

  console.log(`Fetching page ${pageNo} for ${word} (${reading})`);

  const result = await fetch(
    `https://tatoeba.org/en/api_v0/search?from=jpn&query=${word}&to=eng&page=${pageNo}`
  );

  const data = (await result.json()).results;
  const numSentences = 5;

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
    return getTatoebaSentences(word, reading, pageNo + 1);
  }

  return sentences;
};

/*
    Prefers Wanikani data, gets the jlpt level from Jisho
    If not found in Wanikani, gets everything from Jisho
    Returns a VocabInfo object
*/
const createVocabInfo = async (word, reading) => {
  reading = reading?.replace(/(~|～|〜)/g, "");

  const wanikaniResult = await getWanikaniVocab(word, reading);
  if (wanikaniResult) {
    return wanikaniResult;
  } else {
    const jishoResult = await getJishoVocab(word, reading);
    // kana words when i don't provide a reading
    if (jishoResult.reading.includes(word)) reading = word;
    // in case the reading given doesn't match anything, default to the first reading from jisho
    // cuz the reading we want could be the second reading
    jishoResult.sentences = await getTatoebaSentences(
      jishoResult.word,
      jishoResult.reading.includes(reading) ? reading : jishoResult.reading[0]
    );
    return jishoResult;
  }
};

module.exports = {
  createVocabInfo,
};