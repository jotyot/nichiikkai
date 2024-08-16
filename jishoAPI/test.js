require("dotenv").config();
const axios = require("axios");

const dictionaryApiKey = process.env.DICTIONARY_API_KEY;

// axios({
//   method: "post",
//   url: "http://localhost:5041/Dictionary",
//   headers: {
//     ApiKey: dictionaryApiKey,
//   },
//   data: {
//     word_base: {
//       word: "word",
//       reading: "reading",
//       jlpt_level: "jlptLevel",
//       frequency_rank: 0,
//     },
//     readings: [],
//     meanings: [],
//     parts_of_speech: [],
//     sentences: [],
//   },
// });

axios({
  method: "delete",
  url: "http://localhost:5041/Dictionary/筋/すじ",
  headers: {
    ApiKey: dictionaryApiKey,
  },
});
