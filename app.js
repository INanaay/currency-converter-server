
const express = require('express');
const cors = require('cors');
const conversion = require('./convert')

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send("Welcome to the best currency converter server");
});


app.get('/convert', (req, res) => {
  conversion.handleConvertion(req, res);

});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;