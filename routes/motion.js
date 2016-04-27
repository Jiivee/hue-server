var express = require('express');
var router = express.Router();
var request = require('request');

var constants = require('../constants');

var lastMovement;
var movement;
var lightOn = false;
var timeNow;


//These can be changed by the user
var lightTime = 5000;
var motionStatus = true;

var dataOn = {
  "on": true
};

var dataOff = {
  "on": false
};

/* Get motion status */
router.post('/', function(req, res, next) {
  res.send('Motion message received');
  var on = parseInt(req.body.on);
  console.log(on);
  if (on === 1) {
    movement = true;
    if (lightOn === false) {
      sendData(dataOn);
      lightOn = true;
    }
  }
  else {
    lastMovement = Date.now();
    movement = false;
  }
});


/* Get motion interval */
router.post('/lighttime', function(req, res, next) {
  res.send('Motion message received');
  lightTime = parseInt(req.body.lighttime);

});

/* Get motion on (true) or off (false) */
router.post('/status', function(req, res, next) {
  res.send('Motion message received');
  motionStatus = req.body.motionStatus;
});


var timer = setInterval(function() {
  timeNow = Date.now();
  if (timeNow - lastMovement > lightTime && movement === false) {
    sendData(dataOff);
    lightOn = false;
  }
}, 2000);


function sendData(data) {
  if (motionStatus === true) {
    data = JSON.stringify(data);
    request({
      method: 'PUT',
      body: data,
      uri: constants.address + constants.token + 'lights/6/state'
    },
    function (error, response, body) {
      //console.log(response.body);
    });
  }
}

module.exports = router;
