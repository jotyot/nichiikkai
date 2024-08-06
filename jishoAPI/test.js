const { getWanikaniVocab } = require("./fetchVocab.js");
const wanikaniAPIkey = process.env.WANIKANI_API_KEY;

async function main(word) {
  const response = await fetch(
    `https://api.wanikani.com/v2/subjects?types=vocabulary&slugs=${word}`,
    {
      headers: {
        Authorization: `Bearer ${wanikaniAPIkey}`,
      },
    }
  );
  const data = (await response.json()).data;
  console.log(data);
}

main("本");
