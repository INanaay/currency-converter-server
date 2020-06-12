const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

const server = require("../app");

chai.use(chaiHttp);

describe('GET /convert', () => {
  it("Should convert EUR to USD", (done) => {
    chai.request(server)
    .get("/convert")
    .query(({base_currency: "EUR",
    value: 1000,
    quote_currency : "USD"}))
    .end((err, res) => {
      res.should.have.status(200);
      done()
    })
  })
  it("Should convert EUR to BTC", (done) => {
    chai.request(server)
    .get("/convert")
    .query(({base_currency: "EUR",
      value: 1000,
      quote_currency : "BTC"}))
    .end((err, res) => {
      res.should.have.status(200);
      done()
    })
  })

  it("Missing base_currency param, should return 400", (done) => {
    chai.request(server)
    .get("/convert")
    .query(({
      value: 1000,
      quote_currency : "BTC"}))
    .end((err, res) => {
      res.should.have.status(400);
      done()
    })
  })

  it("Wrong value param, should return 400", (done) => {
    chai.request(server)
    .get("/convert")
    .query(({
      base_currency: "EUR",
      value: "wrong",
      quote_currency : "BTC"}))
    .end((err, res) => {
      res.should.have.status(400);
      done()
    })
  })

  it("Non existing currency, should return 200 and null response", (done) => {
    chai.request(server)
    .get("/convert")
    .query(({
      base_currency: "WRONG",
      value: "2000",
      quote_currency : "BTC"}))
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.eql({converted_value: null, history: {}})
      done()
    })
  })

})
