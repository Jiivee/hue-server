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
  var lights = req.body.lights;
  for(i = 0; i < lights.length; i++){
    var data = {
      "sat": saturation,
      "bri": brightness,
      "hue": hue
    };

    sendLightData(data, lights[i]);
  }
});

router.post('/status', function(req, res, next) {
  var lights = req.body.lights;
  var data = {
    "on": req.body.on
  }
  lights.forEach(function(light) {
    sendLightData(data, light);
  })
  res.send("light status updated");
})

var sendLightData = function(data, lightNumber) {
  request({
    method: 'PUT',
    body: JSON.stringify(data),
    uri: constants.address + constants.token + 'lights/' + lightNumber + '/state'
  },
  function (error, response, body) {
    //console.log(response);
    if (!error && response.statusCode == 200) {
      //console.log(body); // Print the google web page.
    }
  });
}

router.get('/:lightNumber', function(req, res, next) {
  //res.send('respond with a resource');

  request({
    method: 'GET',
    uri: constants.address + constants.token + 'lights/' + req.params.lightNumber
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
