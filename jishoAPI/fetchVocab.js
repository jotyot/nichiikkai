require('dotenv').config()
const wanikaniAPIkey = process.env.WANIKANI_API_KEY

/*
    The VocabInfo object has the following properties:
    word: string
    reading: string
    meaning: string[]
    partsOfSpeech: string[]
    jlptLevel: string
    sentences: {japanese: string, english: string}[]
*/

/*
    If word is found, returns a VocabInfo object
    Else returns null
*/
const getWanikaniVocab = async (word) => {
    const response = await fetch(`https://api.wanikani.com/v2/subjects?types=vocabulary&slugs=${word}`, {
        headers: {
            "Authorization": `Bearer ${wanikaniAPIkey}`
        }
    })
    const data = await response.json()
    try {
        const firstResult = data.data[0].data
        return {
            word: firstResult.characters,
            reading: firstResult.readings[0].reading,
            meaning: firstResult.meanings.map(meaning => meaning.meaning),
            partsOfSpeech: firstResult.parts_of_speech,
            jlptLevel: "N/A",
            sentences: firstResult.context_sentences.map(sentence => ({
                japanese: sentence.ja,
                english: sentence.en
            }))
        }
    } catch (error) {
        return null
    }   
}

const getJishoVocab = async (word) => {
  const result = await fetch(
    `https://jisho.org/api/v1/search/words?keyword=${word}`
  );
  const data = await result.json();
  const firstResult = data.data[0];
  const response = {
    word: firstResult.japanese[0].word ?? firstResult.slug,
    reading: firstResult.japanese[0].reading,
    meaning: firstResult.senses[0].english_definitions,
    partsOfSpeech: firstResult.senses[0].parts_of_speech,
    jlptLevel: firstResult.jlpt[0],
    sentences: [],
  };
  return response;
};

const getTatoebaSentences = async (word) => {
  const numSentences = 5;
  const result = await fetch(
    `https://tatoeba.org/en/api_v0/search?from=jpn&query=${word}&to=eng`
  );
  const data = await result.json();
  return data.results.slice(0, numSentences).map((sentence) => ({
    japanese: sentence.text,
    english: sentence.translations[0][0].text,
  }));
};

/*
    Prefers Wanikani data, gets the jlpt level from Jisho
    If not found in Wanikani, gets everything from Jisho
    Returns a VocabInfo object
*/
const createVocabInfo = async (word) => {
  const wanikaniResult = await getWanikaniVocab(word);
  const jishoResult = await getJishoVocab(word);
  if (wanikaniResult) {
    wanikaniResult.jlptLevel = jishoResult.jlptLevel;
    return wanikaniResult;
  } else {
    jishoResult.sentences = await getTatoebaSentences(jishoResult.word);
    return jishoResult;
  }
};

module.exports = {
  createVocabInfo,
};