var express = require('express');
var router = express.Router();

var request = require("request");

var parseString = require('xml2js').parseString;

var config = require('../config/configuration.js');

let device = {
  deviceId : '',
  devicetype : '',
  username : '',
  password : '',
  ipAddress : ''
}

let deviceData = [];

router.get('/', function(req, res, next) {
    res.send('sip is working');
});

//get list of devices of the users.

router.post('/sipdevice', function(req, res, next) {
    let userData = req.body;
    var options = { method: 'POST',
    url: config.apiUrl +'devices_get?',
    qs: 
     { 
       u: config.user,
       user_id: userData.body.user_id,
       hash: config.hash },
    headers: 
     { 'cache-control': 'no-cache' } };
  request(options, function (error, response, body) {
    parseString(body, function (err, result) {
        if(!result.page.error){
            getDevices(result.page);
            if(listOfIds.length > 0)
            {
              deviceData = [];
              getDeviceInformation(listOfIds,function (data){
                res.json(deviceData);

              });
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
        res.json(device);
  
      });
    });
  });

  router.post('/addIPAddress', function(req, res, next) {
    let ipData = req.body.body;
    var options = { method: 'POST',
    url: config.apiUrl +'device_update?',
    qs: 
     { 
       u: config.user,
       device: ipData.deviceId,
       authentication : config.authentication,
       host : ipData.ipAddress,
       port: config.port,
       hash: config.hash },
    headers: 
     { 'cache-control': 'no-cache' } };
  
  request(options, function (error, response, body) {
    parseString(body, function (err, result) {
      res.json(result.page);
    });
  });
  });

  router.post('/addDevice', function(req, res, next) {
    let userData = req.body;
    var options = { method: 'POST',
    url: 'http://62.138.16.114/billing/api/device_create?',
    qs: 
     { 
        u: config.user,
        user_id: userData.body.user_id,
       hash: config.hash },
    headers: 
     { 'cache-control': 'no-cache' } };
    request(options, function (error, response, body) {
      parseString(body, function (err, result) {
        res.json(result.page);
      });
    });
  });

  function getDevices(page){
    let deviceData = page.devices[0].device;
    listOfIds = [];
    for (var i = 0; i < deviceData.length; i++) {
      listOfIds.push(deviceData[i].device_id[0]);
    } 
  
  }

  function getDeviceInformation(listOfIds,callback){

    for(const deviceId of listOfIds){
      getDeviceData(deviceId,function(deviceInfo){
        if(deviceData.length == listOfIds.length)
          callback(deviceData);
      });

    }

 
  }

  function getDeviceData(deviceId,callback){
    var options = { method: 'POST',
    url: 'http://62.138.16.114/billing/api/device_details_get',
    qs: { u: 'admin', device_id: deviceId, hash: config.hashkey },
    headers: 
     { 'cache-control': 'no-cache' } 
    };
  
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      parseString(body, function (err, result) {
        let newDevice = {};
        newDevice.username = result.page.username[0];
        newDevice.devicetype = result.page.device_type[0];
        newDevice.password = result.page.secret[0];
        newDevice.deviceId = deviceId;
        newDevice.ipAddress = result.page.host[0];
        deviceData.push(newDevice);
        callback(newDevice);
  
      });
    });
  }






module.exports = router;
