require('dotenv').config();
const axios = require('axios');

const symbols = process.env.SYMBOLS || 'EUR,USD,GBP';
const api = axios.create({
  baseURL: 'https://api.exchangeratesapi.io',
  // params: {
  //   access_key: process.env.API_KEY,
  // },
  timeout: process.env.TIMEOUT || 5000,
});

const get = async (url) => {
  const response = await api.get(url);
  const {
    data
  } = response;
  if (data.rates) {
    return data;
  }
  throw new Error(data.error.type);
};

module.exports = {
  getRates: () => get(`/latest?symbols=${symbols}&base=EUR`),
  getSymbols: () => ({
    "success": true,
    "symbols": {
      "AED": "United Arab Emirates Dirham",
      "AFN": "Afghan Afghani",
      "ALL": "Albanian Lek",
      "AMD": "Armenian Dram",
    }
  }),
  getHistoricalRate: date => get(`/${date}?symbols=${symbols}&base=EUR`),
};
