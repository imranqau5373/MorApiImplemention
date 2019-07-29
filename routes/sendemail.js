var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');


  

var request = require("request");

var parseString = require('xml2js').parseString;

var config = require('../config/configuration.js');

router.get('/',function(req,res,next){
    console.log(req.query.email);
    res.json('test new.');
});





module.exports = router;
