var express = require('express');
var router = express.Router();
var request = require('request')

var constants = require('../constants');


/* GET users listing. */
router.post('/', function(req, res, next) {
  res.send('respond with a resource');
  console.log(req.body);
  var hue = parseInt(req.body.hue);
  var brightness = parseInt(req.body.brightness);
  var saturation = parseInt(req.body.saturation);
  var data = {
    "on":true,
    "sat": saturation,
    "bri": brightness,
    "hue": hue
  };

  request({
    method: 'PUT',
    body: JSON.stringify(data),
    uri: constants.address + constants.token + 'lights/6/state'
  },
  function (error, response, body) {
    //console.log(response);
    if (!error && response.statusCode == 200) {
      //console.log(body); // Print the google web page.
    }
  });
});

router.get('/', function(req, res, next) {
  //res.send('respond with a resource');

  request({
    method: 'GET',
    uri: constants.address + constants.token + '/lights/6'
  },
  function (error, response, body) {
    //console.log(response);
    if (!error && response.statusCode == 200) {
      //console.log(body); // Print the google web page.
      res.send(body);
    }
  });
});

router.get('/status/all', function(req, res, next) {
  //res.send('respond with a resource');

  request({
    method: 'GET',
    uri: constants.address + constants.token + '/lights'
  },
  function (error, response, body) {
    //console.log(response);
    if (!error && response.statusCode == 200) {
      //console.log(body); // Print the google web page.
      res.send(body);
    }
  });
});

module.exports = router;
