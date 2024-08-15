const { createVocabInfo } = require("./fetchVocab.js");
const axios = require("axios");
const fs = require("fs");
const { parse } = require("csv-parse");
require("dotenv").config();

const dictionaryApiKey = process.env.DICTIONARY_API_KEY;

async function getWordData(word, reading, jlptLevel, frequencyRank) {
  const wordData = await createVocabInfo(word, reading);
  return {
    wordBase: {
      word: word,
      reading: reading,
      jlptLevel: jlptLevel,
      frequencyRank: frequencyRank,
    },
    readings: wordData.readings,
    meanings: wordData.meanings,
    partsOfSpeech: wordData.partsOfSpeech,
    sentences: wordData.sentences,
  };
}

async function uploadWordData(row) {
  try {
    const data = await getWordData(...row);
    if (data.sentences.length === 0)
      fs.appendFile("noSentences.csv", row + "\n", () => {});
    await axios({
      method: "post",
      url: "http://localhost:5041/Dictionary",
      headers: {
        ApiKey: dictionaryApiKey,
      },
      data: data,
    });
  } catch (error) {
    console.log(`Error migrating ${row[0]} (${row[1]})`);
    fs.appendFile("errorWords.csv", row + "\n", () => {});
  }
}

function readCSV() {
  var csvData = [];
  fs.createReadStream("jlpt_vocab.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", (row) => csvData.push(row))
    .on("end", async () => {
      for (let i = 0; i < csvData.length; i++) {
        await uploadWordData(csvData[i]);
      }
    });
}

readCSV();
