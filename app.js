var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const axios = require('axios');
const jsdom = require("jsdom");
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());





app.post('/generateproducts', (req, res) => {
const url = req.body.url;
const { JSDOM } = jsdom;
var config = {
  method: 'get',
  url
};

axios(config)
.then(function (response) {
    let allProducts = []
    let dom = new JSDOM(response.data);
    const table = dom.window.document.querySelectorAll('tr');
    const products = Array.from(table)
    products.forEach(product => {
      const priceBeforeQuantity = parseFloat(product.children[1].children[1].textContent.replace(/,/g, '.'));
      const quantity = parseInt(product.children[0].children[3].textContent.replace(/Qtde.:/,'').replace(/ /g,''));
      productName = product.children[0].children[0].textContent;
      // create({name: productName, price: priceBeforeQuantity / quantity})
      allProducts.push({productName, price: priceBeforeQuantity / quantity})
  })
     res.send(allProducts);
})
.catch(function (error) {
  console.log(error);
});

});
app.use('/', (req, res) => {
  res.json({message: 'alive'});
});
module.exports = app;
