const express = require('express')
const path = require('path')
const axios = require('axios')

const app = express()
const API_URL = 'https://api.exchangeratesapi.io'
const PORT = process.env.port || 5000;

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, 'views')
  })
})

app.get('/rate/:date', (req, res) => {
  const date = req.params.date
  const url = `${API_URL}/${date}?base=USD`

  axios.get(url).then(response => {
    return res.json({
      rates: response.data.rates
    })
  }).catch(err => {
    console.log(err)
  })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
});
