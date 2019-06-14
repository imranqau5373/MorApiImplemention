var express = require('express');
var router = express.Router();

var request = require("request");

var parseString = require('xml2js').parseString;

var config = require('../config/configuration.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', function(req, res, next) {
  console.log(config.hashkey);
  res.json('return login page.');
});

router.post('/login', function(req, res, next) {
  console.log('in login method avc',req.body)
  var options = { method: 'POST',

  url: 'http://62.138.16.114/billing/api/user_login',
  qs: { u:req.body.username, p: req.body.password },
  headers: 
   { 'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    parseString(body, function (err, result) {
      console.log(result.action);
      console.log(result.action.status[0]);
      if(result.action.status[0] == "ok")
      res.json(JSON.stringify({status : true ,loginId : result.action.user_id[0]}));
      else
      res.json({status : false});

    });

});
  
});

module.exports = router;
