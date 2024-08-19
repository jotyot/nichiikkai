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
//       meaning: "meaning",
//       jlpt_level: "N1",
//       frequency_rank: 1,
//     },
//     readings: [],
//     meanings: [],
//     parts_of_speech: [],
//     sentences: [],
//   },
// });

// axios({
//   method: "delete",
//   url: "http://localhost:5041/Dictionary/word/reading",
//   headers: {
//     ApiKey: dictionaryApiKey,
//   },
// });
