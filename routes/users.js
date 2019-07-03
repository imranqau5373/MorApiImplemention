var express = require('express');
var router = express.Router();

var request = require("request");

var parseString = require('xml2js').parseString;

var config = require('../config/configuration.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', function(req, res, next) {
  console.log(config.hashkey);
  res.json('return login page.');
});

router.post('/login', function(req, res, next) {
  var options = { method: 'POST',

  url: 'http://62.138.16.114/billing/api/user_login',
  qs: { u:req.body.username, p: req.body.password},
  headers: 
   { 'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    parseString(body, function (err, result) {
      if(result.action.status[0] == "ok")
      res.json({status : true ,loginId : result.action.user_id[0]});
      else
      res.json({status : false});
    });

});
  
});

router.post('/register', function(req, res, next) {
  let registerData = req.body;
  var options = { method: 'POST',
  url: 'http://62.138.16.114/billing/api/user_register?id=385c83488c',
  qs: 
   { 
     username: registerData.body.username,
     password: registerData.body.password,
     password2: registerData.body.password2,
     first_name: registerData.body.firstname,
     last_name: registerData.body.lastname,
     country_id: registerData.body.country_id,
     email: registerData.body.email,
     device_type: registerData.body.device_type,
     currency : registerData.body.currency_id
     },
  headers: 
   { 'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
  console.log(body);
  parseString(body, function (err, result) {
    console.log(result.page);
    res.json(result.page);
  });
});
});

router.post('/details', function(req, res, next) {

  var options = { method: 'POST',
  url: 'http://62.138.16.114/billing/api/user_details_get',
  qs: { u:req.body.username, user_id: req.body.user_id },
  headers: 
   { 'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    parseString(body, function (err, result) {
      res.json(result.page);
    });

});
  
});

//this api method returns the euro amount in dollar rates.
router.get('/getcurrency', function(req, res, next) {
  let dollarRate =config.dollarRate;
  let amount = req.query.amount;
  let totalAmount = amount * dollarRate;
  res.json(totalAmount);
});



module.exports = router;
