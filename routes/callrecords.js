var express = require('express');
var router = express.Router();

var request = require("request");

var parseString = require('xml2js').parseString;

var config = require('../config/configuration.js');

router.post('/',function(req,res){
    let callrecords = req.body;
     console.log(callrecords.body.userId);
    var options = { method: 'POST',
    url: 'http://62.138.16.114/billing/api/user_calls_get',
    qs: { u: callrecords.body.userName, user_id: callrecords.body.userId,period_start:callrecords.body.startDate,period_end : callrecords.body.endDate,s_call_type:'all', hash: '385c83488c' },
    headers: 
    { 'cache-control': 'no-cache' } 
    };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);
    parseString(body, function (err, result) {
        console.log(result);
        res.json(result);

    });
    });
   
})



module.exports = router;
