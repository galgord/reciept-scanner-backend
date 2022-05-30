var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const axios = require('axios');
const jsdom = require("jsdom");
const config = require('./config');
const { Pool } = require('pg');
const pool = new Pool(config.db);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.post('/addProduct', (req, res) => {
const url = req.body.url;
const { JSDOM } = jsdom;
var config = {
  method: 'get',
  url
};
async function create(product) {
  const result = await pool.query(
    'INSERT INTO products(name, price) VALUES ($1, $2) RETURNING *',
    [product.name, product.price]
  );
  let message = 'Error in creating quote';

  if (result.length) {
    message = 'Quote created successfully';
  }

  return {message};
}

axios(config)
.then(function (response) {
    let dom = new JSDOM(response.data);
    const table = dom.window.document.querySelectorAll('tr');
    const products = Array.from(table)
    products.forEach(product => {
      const priceBeforeQuantity = parseFloat(product.children[1].children[1].textContent.replace(/,/g, '.'));
      const quantity = parseInt(product.children[0].children[3].textContent.replace(/Qtde.:/,'').replace(/ /g,''));
      productName = product.children[0].children[0].textContent;
      create({name: productName, price: priceBeforeQuantity / quantity})
  })
     res.send('done');
})
.catch(function (error) {
  console.log(error);
});

});
app.get('/products', (req, res) => {
   const query = async (query, params) => {
    const {rows, fields} = await pool.query(query, params);
    return rows;
}
});
app.use('/', (req, res) => {
  res.json({message: 'alive'});
});
module.exports = app;
