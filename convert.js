const axios = require('axios');

const handleConvertion = (req, res) => {
  const {query} = req;
  if (!isBodyValid(query)) {
    res.status(400).send("Missing Parameters");
    return;
  }
  convertCurrency(query, res);
};

const convertCurrency = (body, res) => {
  let JSONresponse = {};
  const url = `https://min-api.cryptocompare.com/data/price?fsym=${body.base_currency}&tsyms=${body.quote_currency}`;
  const historyUrl = `https://min-api.cryptocompare.com/data/exchange/histoday?tsym=${body.quote_currency}&limit=10`;

  const ratePromise = axios.get(url);
  const historyPromise = axios.get(historyUrl);
  Promise.all([ratePromise, historyPromise]).then((values) => {
    if (values[0].status === 200 && values[1].status === 200) {
      console.log(values[0].data);
      const rate = values[0].data[body.quote_currency]
      const value = Number(body.value);
      if (isNaN(value)) {
        res.status(400).send("Invalid Value Parameter");
        return;
      }
      JSONresponse.converted_value = rate * value;

      JSONresponse.history = values[1].data.Data;
      res.send(JSONresponse);

    }
    else
      res.status(400).send("Something went wrong");
  });

};

const isBodyValid = (body) => {
  return (body.hasOwnProperty("base_currency" ) && body.hasOwnProperty("value") &&
    body.hasOwnProperty("quote_currency"))
};


module.exports = {
  handleConvertion
};
