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
var motionSetting = "timer" ##Timer or switch

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
    else{
      if(motionSetting === "switch" && Date.now() - lastMovement > 2000){
        sendData(dataOff);
        lightOn = false;
      }
    }
  }
  else {
    lastMovement = Date.now();
    movement = false;
  }
});

/*Get motion setting */
router.post('/motionSetting', function(req, res, next) {
  newSetting = req.body.motionSetting;
  if(newSetting === "timer" || newSetting === "switch"){
    motionSetting = newSetting;
    res.send('Motion setting received');
  }
  else{
    res.send('Motion setting '+newSetting+ " is not recognized");
  }
  
})

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
  if (timeNow - lastMovement > lightTime && movement === false && motionSetting === "timer") {
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
