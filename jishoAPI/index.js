const express = require('express')
const app = express()
const port = 3000

const { getJishoVocab, getWanikaniVocab } = require('./fetchVocab.js')

app.get('/lookup/:word', async (req, res) => {
    
    const word = req.params.word
    try {
        const result = await getWanikaniVocab(word) ?? await getJishoVocab(word)
        res.send(result)
    } catch (error) {
        res.status(500).send('An error occurred')
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})