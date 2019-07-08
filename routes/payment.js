var express = require('express');
var router = express.Router();

var request = require("request");

var paypal = require('paypal-rest-sdk');

var parseString = require('xml2js').parseString;

var config = require('../config/configuration.js');

//Paypal keys

// paypal.configure({
//     'mode': 'live', //sandbox or live
//     'client_id': 'ARy2xnp9Q2c-nr7Po8B8KjVb9TKQG__z-ZjX6YIqxEoD-fb1ZokxrbPOk0c0ygzo-pyQszz8t3oglviu',
//     'client_secret': 'EBVstt-JupA9hWWZxzofGxWri9jDGw8oXtxO0Gk996jh9QyTWAKDN53ZESD7f6Ba4PR-tg1gZx-v4z52'
//   });

  
// //Sand box Account details.
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AXxtAiKMnbQAmDO6FrgO48UJ0oCGbqdI_bsHpfqHSJXSrTaVpPMjnJwQMuWeBCC4dzOlrHg5IFCNCL3k',
  'client_secret': 'EBmFQoh3gJcIxDjxAO6tQdWtDiraxNWFWjPEXGBfkE8Ht9WAlkq-RkGcPVt2wKyuFIUO4gVnuZQYyvFS'
});

var isoDate = new Date();
isoDate.setMonth(isoDate.getMonth() + 1);
isoDate.toISOString().slice(0, 19) + 'Z';
let userid = '';

var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/#/paymentsuccess",
        "cancel_url": "http://localhost:3000/paymentinteg/cancelPayment",
        // "return_url": "http://62.138.16.114:3000/paymentinteg/successPayment",
        // "cancel_url": "http://62.138.16.114:3000/paymentinteg/cancelPayment",
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": "1.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "1.00"
        },
        "description": "This is the payment description."
    }]
};

var execute_payment_json = {
    "payer_id": "",
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "1.00"
        }
    }]
  };




router.get('/', function(req, res, next) {
    res.send('test is working');
  });

  

  router.post('/', function(req, res) {
    //   res.json('payment response');
     let checkoutData = req.body;
    create_payment_json.transactions[0].amount.currency =  checkoutData.body.currency;
    let processingFee = checkoutData.body.amount * 0.015;
    let totalAmount = (parseInt(checkoutData.body.amount) + processingFee).toFixed(2);
    console.log(totalAmount);
    // //total amount and price must be the same. other wise getting validation errors.
    create_payment_json.transactions[0].amount.total =  totalAmount;
    create_payment_json.transactions[0].description =  checkoutData.body.amount;
    create_payment_json.transactions[0].item_list.items[0].price= totalAmount;
    create_payment_json.transactions[0].item_list.items[0].currency= checkoutData.body.currency;
    execute_payment_json.transactions[0].amount.total = totalAmount;
    execute_payment_json.transactions[0].amount.currency = checkoutData.body.currency;

    userid = checkoutData.body.userid; 
    //res.json(create_payment_json);
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log('error is ',error.response.details);
            console.log(error);
        } else {
            console.log(payment);
            let redirectUrl = ''; 

            for (var index = 0; index < payment.links.length; index++) {
                if (payment.links[index].rel === 'approval_url') {
                    var approval_url = payment.links[index].href;
                    redirectUrl = approval_url;
                }
            }
            console.log('Redirect url is'+redirectUrl);
            res.json(redirectUrl);
        }
    });
});

router.get('/cancelPayment', function(req, res, next) {
    res.json('cancel payment');
  });

  router.get('/paymentmessage', function(req, res, next) {
    res.json('success payment');
  });







module.exports = router;
