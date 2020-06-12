const request = require('request');


const handleConvertion = (req, res) => {
  const {body} = req;

  if (!isBodyValid(body)) {
    res.status(400).send("Missing Parameters");
    return;
  }
  convertCurrency(body, res);

};

const convertCurrency = (body, res) => {
  const url = `https://min-api.cryptocompare.com/data/price?fsym=${body.base_currency}&tsyms=${body.quote_currency}`;
  request(url, (error, response, responseBody) => {
    if (!error && response.statusCode === 200) {
      responseBody = JSON.parse(responseBody);
      const rate = responseBody[body.quote_currency];
      const value = Number(body.value);
      if (isNaN(value)) {
        res.status(400).send("Invalid Value Parameter");
        return;
      }
      const JSONresponse = {"converted_value" : rate * Number(body.value)};
      res.send(JSONresponse)
    }
    else {
      res.status(400).send("Invalid Parameters");
    }
  })
};

const isBodyValid = (body) => {
  return (body.hasOwnProperty("base_currency" ) && body.hasOwnProperty("value") &&
    body.hasOwnProperty("quote_currency"))
};




module.exports = {
  handleConvertion
};