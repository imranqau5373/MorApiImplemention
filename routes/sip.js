var express = require('express');
var router = express.Router();

var request = require("request");

var parseString = require('xml2js').parseString;

var config = require('../config/configuration.js');


router.get('/', function(req, res, next) {
    res.send('sip is working');
});

router.post('/sipdevice', function(req, res, next) {
    console.log(req.body.user_id);
    var options = { method: 'POST',
    url: config.apiUrl +'devices_get?',
    qs: 
     { 
       u: config.user,
       user_id: req.body.user_id,
       hash: config.hash },
    headers: 
     { 'cache-control': 'no-cache' } };
  console.log(options.url);
  request(options, function (error, response, body) {
    parseString(body, function (err, result) {
        console.log(result.page.error);
        if(!result.page.error){
            getDevices(result.page);
            if(listOfIds.length > 0)
            {
              res.json(listOfIds);
            }
            else
            res.json(result.page);
        }
        else
            res.json("Error ");

    });
  });
  });

  router.post('/deviceInformation', function(req, res, next) {
    let deviceId = req.body.deviceId;
    console.log(deviceId)
    var options = { method: 'POST',
    url: 'http://62.138.16.114/billing/api/device_details_get',
    qs: { u: 'admin', device_id: deviceId, hash: config.hashkey },
    headers: 
     { 'cache-control': 'no-cache' } 
    };
  
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      parseString(body, function (err, result) {
        device.username = result.page.username[0];
        device.devicetype = result.page.device_type[0];
        device.password = result.page.secret[0];
        device.deviceId = deviceId;
        device.ipAddress = result.page.host[0];
        console.log(device);
        res.json(device)
  
      });
    });
  });

  function getDevices(page){
    let deviceData = page.devices[0].device;
    listOfIds = [];
    for (var i = 0; i < deviceData.length; i++) {
      listOfIds.push(deviceData[i].device_id[0])
    } 
  
  }






module.exports = router;
