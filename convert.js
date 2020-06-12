const request = require('request');

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

  getRequest(url).then((conversionBody) => {
    conversionBody = JSON.parse(conversionBody);
    const rate = conversionBody[body.quote_currency];
    const value = Number(body.value);
    if (isNaN(value)) {
      res.status(400).send("Invalid Value Parameter");
      return;
    }
    JSONresponse.converted_value = rate * value;
    return getRequest(historyUrl)
  }).then((historyBody) => {
    historyBody = JSON.parse(historyBody);
    JSONresponse.history = historyBody.Data;

    res.send(JSONresponse);
  });





};

const getRequest = (url) => {
  return new Promise(function (success, failure) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        success(body);
      } else {
        failure(error);
      }
    });
  });
}

const isBodyValid = (body) => {
  return (body.hasOwnProperty("base_currency" ) && body.hasOwnProperty("value") &&
    body.hasOwnProperty("quote_currency"))
};




module.exports = {
  handleConvertion
};
