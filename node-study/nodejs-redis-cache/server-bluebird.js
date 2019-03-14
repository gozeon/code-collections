const express = require('express')
const path = require('path')
const axios = require('axios')
const redis = require('redis')
const bluebird = require("bluebird")
bluebird.promisifyAll(redis)

const app = express()
const API_URL = 'https://api.exchangeratesapi.io'
const PORT = process.env.port || 5002
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const client = redis.createClient(REDIS_URL)

client.on('connect', () => {
  console.log(`connected to redis`)
})
client.on('error', err => {
  console.log(`Error: ${err}`)
})

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, 'views')
  })
})

app.get('/rate/:date', (req, res) => {
  const date = req.params.date
  const url = `${API_URL}/${date}?base=USD`

  const countKey = `USD:${date}:count`
  const ratesKey = `USD:${date}:rates`
  let count

  client
    .incrAsync(countKey)
    .then(result => {
      count = result;
      return count
    })
    .then(() => client.hgetallAsync(ratesKey))
    .then(rates => {
      if (rates) {
        return res.json({
          rates,
          count
        })
      }

      axios.get(url).then(response => {
        client
          .hmsetAsync(ratesKey, response.data.rates)
          .catch(e => {
            console.log(e)
          });

        return res.json({
          count,
          rates: response.data.rates
        });
      }).catch(error => res.json(error.response.data))
    })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})
