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

const sentenceReadingFilter = (reading) => (sentence) => {
  return sentence.transcriptions?.[0]?.text
    .replace(/(\[|\||\])/g, "")
    .includes(reading);
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
    `https://tatoeba.org/en/api_v0/search?from=jpn&query=@text+"${word}"+@transcription+${reading}&to=eng&page=${pageNo}`
  );

  if (!result.ok) return [];

  const data = (await result.json()).results;
  const numSentences = 5;

  if (data.length === 0) return [];

  const sentences = data
    .filter(sentenceReadingFilter(reading))
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
