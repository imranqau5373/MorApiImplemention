var express = require('express');
var router = express.Router();

var request = require("request");

var parseString = require('xml2js').parseString;

var config = require('../config/configuration.js');

router.get('/', function(req, res, next) {
    res.send('test is working');
  });



module.exports = router;
