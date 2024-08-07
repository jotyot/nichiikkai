const { createVocabInfo } = require("./fetchVocab.js");
const axios = require("axios");
const fs = require("fs");
const { parse } = require("csv-parse");

async function getWordData(word, reading, jlptLevel, frequencyRank) {
  const wordData = await createVocabInfo(word, reading);
  return {
    wordPair: {
      word: word,
      reading: reading,
    },
    jlptLevel: jlptLevel,
    readings: wordData.readings,
    meanings: wordData.meanings,
    partsOfSpeech: wordData.partsOfSpeech,
    sentences: wordData.sentences,
    frequencyRank: frequencyRank,
  };
}

async function uploadWordData(row) {
  try {
    await axios({
      method: "post",
      url: "http://localhost:5041/Dictionary",
      data: await getWordData(...row),
    });
  } catch (error) {
    fs.appendFile("errorWords.csv", row + "\n", (err) => {
      if (err) {
        console.log(err);
      }
    });
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
