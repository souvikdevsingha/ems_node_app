const express = require('express')
var env = require('dotenv').config()
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
//var mongoose = require('mongoose');
var cors=require('cors');
var mongoose = require('./db/connection');
cors = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "accept, content-type, x-access-token, x-requested-with,Authorization");
  next();
};

app.use(cors)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/EMS', require('./routes/routes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});