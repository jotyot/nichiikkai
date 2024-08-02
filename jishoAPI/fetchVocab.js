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
  word = word.replace(/(~|～)/g, "〜")

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
      return null;
    }
    return vocabObject;
  } catch (error) {
    return null;
  }
};

const getJishoVocab = async (word, reading) => {
  word = word.replace(/(~|～|〜)/g, "");

  // filter out words that don't match the reading
  const getReading = (entry) => {
    const readingMatch = entry.japanese
      .filter(
        (japanese) => japanese.word === word || japanese.word === undefined
      )
      .map((japanese) => japanese.reading);
    return readingMatch.length > 0 ? readingMatch : [entry.japanese[0].reading];
  };

  const result = await fetch(
    `https://jisho.org/api/v1/search/words?keyword=${word}`
  );
  const data = await result.json();
  const firstResult =
    data.data.find((result) => getReading(result).includes(reading)) ??
    data.data[0];
  const response = {
    word: firstResult.japanese[0].word ?? firstResult.slug,
    reading: getReading(firstResult),
    meaning: firstResult.senses[0].english_definitions,
    partsOfSpeech: firstResult.senses[0].parts_of_speech,
    sentences: [],
  };
  return response;
};

/*
  Use sentence transcriptions to filter out sentences that don't match the reading
*/
const getTatoebaSentences = async (word, reading) => {
  word = word.replace(/(~|～|〜)/g, "");

  const result = await fetch(
    `https://tatoeba.org/en/api_v0/search?from=jpn&query=${word}&to=eng`
  );
  const data = (await result.json()).results;
  const numSentences = 5;
  return data
    .filter((sentence) => {
      if (reading === undefined) return true;
      if (reading === word) return true;

      const transcription = sentence.transcriptions[0].text;
      const regex = /\[(.*?)\]/g;
      const matches = transcription.match(regex);
      if (matches == null) return false;

      // [[kanji, kana, kana, ...], [kanji, kana, ...], ...]
      // assuming the format is whole kanji word, with kana readings of each kanji
      const words = matches.map((match) => match.slice(1, -1).split("|"));
      return words.some((wordArray) => {
        console.log(wordArray);
        const wordStartIndex = wordArray[0].indexOf(word[0]);
        if (wordStartIndex === -1) return false;

        // try to match the kanjis in wordArray[0] to the kanas in wordArray
        return (
          wordArray
            .slice(wordStartIndex + 1, word.length + wordStartIndex + 1)
            .join("") === reading
        );
      });
    })
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
};

/*
    Prefers Wanikani data, gets the jlpt level from Jisho
    If not found in Wanikani, gets everything from Jisho
    Returns a VocabInfo object
*/
const createVocabInfo = async (word, reading) => {
  const wanikaniResult = await getWanikaniVocab(word, reading);
  const jishoResult = await getJishoVocab(word, reading);
  // in case the reading given doesn't match anything, default to the first reading from jisho
  // cuz the reading we want could be the second reading
  if (wanikaniResult) {
    return wanikaniResult;
  } else {
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