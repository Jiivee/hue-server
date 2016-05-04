var express = require('express');
var router = express.Router();
var request = require('request');

var constants = require('../constants');

var lastMovement;
var movement;
var timeNow;


//These can be changed by the user
var lightTime = 5000;
var motionStatusList = [null, true, true, true, true, true, true]; //There is no lamp 0
var motionType = "switch" //Timer or switch

var dataOn = {
  "on": true
};

var dataOff = {
  "on": false
};

var checkAndSwicthLight = function(lightNumber) {
  request({
    method: 'GET',
    uri: constants.address + constants.token + 'lights/' + lightNumber
  },
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log(body); // Print the google web page.
      var lightBody = JSON.parse(body);
      console.log('light state: '+ lightBody.state.on);
      if(lightBody.state.on) {
        if(motionType === 'switch' && Date.now() - lastMovement > 2000) {
          console.log('Light '+lightNumber+' is switched off');
          sendData(dataOff, lightNumber);
        }
      }
      else {
        console.log('Light '+lightNumber+' is switched on');
        sendData(dataOn, lightNumber);
      }
    }
    else {
      console.log('Error with, response code: '+response.statusCode);
    }
  });
};

/*
Handles the motion sensor post requests from Rasperry Pi
*/
router.post('/', function(req, res, next) {
  res.send('Motion message received');
  var on = parseInt(req.body.on);
  console.log("Current motion status: "+on);
  if (on === 1) { //Motion started
    movement = true; //Used in timer below

    //Check if motion enabled for each light and if light should be switched on or off
    for(lightNumber = 1; lightNumber < motionStatusList.length; lightNumber++){
      //If motion is enabled for lamp and lamp is not on, it is switched on
      if(motionStatusList[lightNumber]){
        //If timer setting is used, the lamp is switched off from the timer function below
        //Light is not switched off if it is less than two seconds since previous movement to prevent accidental constant switching on and off
        checkAndSwicthLight(lightNumber);
      }

    }
  }
  else { //Motion stopped
    lastMovement = Date.now();
    movement = false;
  }
});
//Timer checks every two seconds if light should be switched off
//Light is switched off if more than 'lightTime' amount of time has passed since previous movement
var timer = setInterval(function() {
  timeNow = Date.now();
  for(lightNumber = 1; lightNumber < motionStatusList.length; lightNumber++){
    if (timeNow - lastMovement > lightTime && movement === false && motionType === "timer" && motionStatusList[lightNumber]) {
      sendData(dataOff, lightNumber);
    }
  }
}, 2000); //Two seconds

/*Get motion type */
router.post('/motionType', function(req, res, next) {
  newType = req.body.motionType;
  if(newType === "timer" || newType === "switch"){
    motionType = newType;
    console.log("New motion type: " + motionType);
    res.send('Motion type received');
  }
  else{
    res.send('Motion type '+newType+ ' is not recognized');
  }

})

/* Get motion interval */
router.post('/lighttime', function(req, res, next) {
  res.send('Motion message received');
  lightTime = parseInt(req.body.lighttime)*1000*60; //Minutes
  console.log('New lighttime: '+ lightTime)
});

/* Get motion on (true) or off (false) */
router.post('/status', function(req, res, next) {
  res.send('Motion message received');
  lightNumberList = req.body.lights;
  motionStatus = req.body.motionStatus;
  lightNumberList.forEach(function(lightNumber) {
    if(motionStatus){
      motionStatusList[lightNumber] = true;
    }
    else {
      motionStatusList[lightNumber] = false;
    }
  })
  console.log('Updated motion status list: '+motionStatusList);
});

/*
Get current motionStatus
*/
router.get('/motionStatus/:lightNumber', function(req, res, next) {
  var data = {
    'status': motionStatusList[req.params.lightNumber]
  };
  res.send(data);
});

/*
Get current motionType
*/
router.get('/motiontype', function(req, res, next) {
  var data = {
    'type': motionType
  };
  res.send(data);
});


function sendData(data, lightNumber) {
  if (motionStatusList[lightNumber] === true) {
    data = JSON.stringify(data);
    request({
      method: 'PUT',
      body: data,
      uri: constants.address + constants.token + 'lights/' + lightNumber + '/state'
    },
    function (error, response, body) {
      //console.log(response.body);
    });
  }
}

module.exports = router;
