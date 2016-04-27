var express = require('express');
var router = express.Router();
var request = require('request');

var lastMovement;
var movement;
var lightOn = false;
var timeNow;


//These can be changed by the user
var lightTime = 10000;
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
  console.log(motionStatus);
  console.log(motionStatus === true);
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
      uri: constants.address + constants.token + '6/state'
    },
    function (error, response, body) {
      //console.log(response);
      if (!error && response.statusCode == 200) {
        //console.log(body); // Print the google web page.
        console.log();
      }
    });
  }
}

module.exports = router;
