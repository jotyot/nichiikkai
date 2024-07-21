const wanikaniAPIkey = process.env.WANIKANI_API_KEY
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

const JishoAPI = require('unofficial-jisho-api')
const jisho = new JishoAPI()

const getJishoVocab = async (word) => {
    const result = await jisho.searchForPhrase(word)
    const firstResult = result.data[0]
    const response = {
        word: firstResult.japanese[0].word,
        reading: firstResult.japanese[0].reading,
        meaning: firstResult.senses[0].english_definitions,
        partsOfSpeech: firstResult.senses[0].parts_of_speech,
        jlptLevel: firstResult.jlpt[0],
    }
    const sentences = await jisho.searchForExamples(word)
    // Needs a more sophisticated way to choose sentences
    response.sentences = sentences.results.slice(0, 3).map(sentence => ({
        japanese: sentence.kanji,
        english: sentence.english,
    }))
    return response
}

module.exports = {
    getWanikaniVocab,
    getJishoVocab
}