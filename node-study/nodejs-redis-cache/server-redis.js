const express = require('express')
const path = require('path')
const axios = require('axios')
const redis = require('redis')

const app = express()
const API_URL = 'https://api.exchangeratesapi.io'
const PORT = process.env.port || 5001;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const client = redis.createClient(REDIS_URL);

client.on('connect', () => {
  console.log(`connected to redis`);
});
client.on('error', err => {
  console.log(`Error: ${err}`);
});

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

  client.incr(countKey, (err, count) => {
    client.hgetall(ratesKey, function (err, rates) {
      if (rates) {
        return res.json({
          rates,
          count
        });
      }

      axios.get(url).then(response => {
        client.hmset(ratesKey, response.data.rates, function (err) {
          if (err) {
            console.log(err)
          }
        })

        return res.json({
          rates: response.data.rates
        })
      }).catch(err => {
        console.log(err)
      })

    })
  })


})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
});
