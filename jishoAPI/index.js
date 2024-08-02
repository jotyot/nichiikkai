const express = require('express')
const app = express()
const port = 3000

const { createVocabInfo } = require("./fetchVocab.js");

app.get("/lookup/:word/:reading?", async (req, res) => {
  const word = req.params.word;
  const reading = req.params.reading;
  console.log(`Looking up ${word} (${reading})`);
  try {
    const result = await createVocabInfo(word, reading);
    res.send(result);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})