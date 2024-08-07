const { getTatoebaSentences } = require("./fetchSentences.js");

require("dotenv").config();
const wanikaniAPIkey = process.env.WANIKANI_API_KEY;

/*
  The VocabInfo object has the following properties:
  word: string
  reading: string
  readings: string[]
  meanings: string[]
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
      reading: undefined,
      readings: firstResult.readings
        .filter((r) => r.accepted_answer)
        .map((r) => r.reading),
      meanings: firstResult.meanings.map((meaning) => meaning.meaning),
      partsOfSpeech: firstResult.parts_of_speech,
      sentences: firstResult.context_sentences.map((sentence) => ({
        japanese: sentence.ja,
        english: sentence.en,
      })),
    };

    if (reading) {
      if (!vocabObject.reading.includes(reading))
        throw new Error("Reading doesn't match");
      else vocabObject.reading = reading;
    } else vocabObject.reading = vocabObject.readings[0];

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

const kanaOnlyEntry = (data, word) => {
  return data.find((entry) =>
    entry.japanese.some(
      (japanese) => japanese.reading === word && japanese.word === undefined
    )
  );
};

const readingMatchEntries = (data, word, reading) => {
  return data.filter((entry) => {
    const readings = getReadingsFromJishoEntry(entry, word);
    return readings.includes(reading) || readings.includes(word);
  });
};

const suffixSenseFilter = (sense) => {
  const s = sense.parts_of_speech.map((se) => se.toLowerCase());
  return (
    s.includes("counter") ||
    s.some((part) => part.includes("suffix")) ||
    s.includes("suffix") ||
    s.includes("auxiliary verb")
  );
};

const suffixEntry = (data) => {
  return data.find((entry) => entry.senses.some(suffixSenseFilter));
};

const getJishoVocab = async (word, reading) => {
  const isSuffix = word.match(/(~|～|〜).+/g) !== null;
  word = word.replace(/(~|～|〜)/g, "");

  const result = await fetch(
    `https://jisho.org/api/v1/search/words?keyword=${word}`
  );
  const data = (await result.json()).data;

  var chosenEntry;
  const readingMatches = readingMatchEntries(data, word, reading);
  if (readingMatches.length === 0) {
    if (reading) throw new Error("Reading doesn't match");
    chosenEntry = data[0];
  } else {
    if (isSuffix)
      chosenEntry = suffixEntry(readingMatches) ?? readingMatches[0];
    else chosenEntry = kanaOnlyEntry(readingMatches, word) ?? readingMatches[0];
  }

  const chosenSense = isSuffix
    ? chosenEntry.senses.find(suffixSenseFilter) ?? chosenEntry.senses[0]
    : chosenEntry.senses[0];

  const response = {
    word:
      chosenEntry.japanese.find((japanese) => japanese.word === word)?.word ?? // find the word with requested kanji
      chosenEntry.japanese.find((japanese) => japanese.reading === word)
        ?.reading ?? // find word if it's a reading
      chosenEntry.japanese[0].word ?? // if no match, default to first word
      chosenEntry.japanese[0].reading, // and some dont have words and are just readings
    reading: undefined,
    readings: getReadingsFromJishoEntry(chosenEntry, word),
    meanings: chosenSense.english_definitions,
    partsOfSpeech: chosenSense.parts_of_speech,
    sentences: [],
  };

  if (response.readings.includes(word)) response.reading = word;
  else if (response.readings.includes(reading)) response.reading = reading;
  else response.reading = response.readings[0];

  return response;
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
    jishoResult.sentences = await getTatoebaSentences(jishoResult);
    return jishoResult;
  }
};

module.exports = {
  createVocabInfo,
  getWanikaniVocab,
};
