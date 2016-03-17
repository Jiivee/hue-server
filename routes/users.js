var express = require('express');
var router = express.Router();
var request = require('request');


/* GET users listing. */
router.post('/', function(req, res, next) {
  res.send('respond with a resource');
  var hue = req.body.hue;
  var brightness = req.body.brightness;
  var saturation = req.body.saturation;
  var data = {
    "on":true,
    "sat": saturation,
    "bri": brightness,
    "hue": hue
  };

  request({
    method: 'PUT',
    body: JSON.stringify(data),
    uri: 'http://192.168.1.7/api/GYRwirkQ698vzLpqkUe-gEu2wkWMxPZg6bjzZukI/lights/6/state'
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
    uri: 'http://192.168.1.7/api/GYRwirkQ698vzLpqkUe-gEu2wkWMxPZg6bjzZukI/lights/6'
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
