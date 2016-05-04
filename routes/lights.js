var express = require('express');
var router = express.Router();
var request = require('request')

var constants = require('../constants');



/* Set new values for light */
router.post('/', function(req, res, next) {
  res.send('Light data received');
  console.log(req.body);
  var hue = parseInt(req.body.hue);
  var brightness = parseInt(req.body.brightness);
  var saturation = parseInt(req.body.saturation);
  var lights = req.body.lights; //List of affected lights
  for(i = 0; i < lights.length; i++){
    var data = {
      "sat": saturation,
      "bri": brightness,
      "hue": hue
    };

    sendLightData(data, lights[i]);
  }
});

//Switch lights on or off
router.post('/status', function(req, res, next) {
  var lights = req.body.lights; //List of affected lights
  var data = {
    "on": req.body.on
  }
  lights.forEach(function(light) {
    sendLightData(data, light);
  })
  res.send("light status updated");
})

/*
Send new light data to Philipsp Hue lamps
*/
var sendLightData = function(data, lightNumber) {
  request({
    method: 'PUT',
    body: JSON.stringify(data),
    uri: constants.address + constants.token + 'lights/' + lightNumber + '/state'
  },
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log(body);
    }
  });
}

/* Get status of certain light */
router.get('/:lightNumber', function(req, res, next) {
  request({
    method: 'GET',
    uri: constants.address + constants.token + 'lights/' + req.params.lightNumber
  },
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
});

/*
Get status of all lamps
*/
router.get('/status/all', function(req, res, next) {
  request({
    method: 'GET',
    uri: constants.address + constants.token + 'lights'
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
