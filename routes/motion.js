var express = require('express');
var router = express.Router();
var request = require('request');

var constants = require('../constants');

var lastMovement;
var movement;
var timeNow;


//These can be changed by the user
var lightTime = 5000;
var motionStatusList = [null, true, true, true, true, true, true];
var motionType = "switch" //Timer or switch

var dataOn = {
  "on": true
};

var dataOff = {
  "on": false
};

var isLightOn = function(lightNumber) {
  request({
    method: 'GET',
    uri: constants.address + constants.token + 'lights/' + lightNumber
  },
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //console.log(body); // Print the google web page.
      var lightBody = JSON.parse(body);
      if(lightBody.state.on) {
        console.log('Valo '+lightNumber+' on päällä');
        return true;
      }
      else {
        console.log('Valo '+lightNumber+' ei ole päällä');
        return false;
      }
    }
    else{
      console.log("Tapahtui virhe, response code: "+response.statusCode);
    }
  });
}

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
      console.log("looping througs lights, current: "+lightNumber);
      console.log("motion status "+motionStatusList[lightNumber] );
      //If motion is enabled for lamp and lamp is not on, it is switched on
      if(motionStatusList[lightNumber] && !isLightOn(lightNumber)){
        sendData(dataOn, lightNumber); //Philips hue lights are numbered 1-6
      }
      //If timer setting is used, the lamp is switched off from the timer function below
      //Light is not switched off if it is less than two seconds since previous movement to prevent accidental constant switching on and off
      else if(motionStatusList[lightNumber] && motionType === "switch" && Date.now() - lastMovement > 2000 && isLightOn(lightNumber)){
        sendData(dataOff);
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
    if (timeNow - lastMovement > lightTime && movement === false && motionType === "timer" && motionStatusList[lightNumber] && isLightOn[lightNumber]) {
      sendData(dataOff, lightNumber);
    }
  }
}, 2000); //Two seconds

/*Get motion setting */
router.post('/motionType', function(req, res, next) {
  newType = req.body.motionType;
  if(newType === "timer" || newType === "switch"){
    motionType = newType;
    console.log("New motion type: " + motionType);
    res.send('Motion type received');
  }
  else{
    res.send('Motion type '+newType+ " is not recognized");
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
  lightNumberList = req.body.lights;
  motionStatus = req.body.motionStatus;
  console.log('motion status: '+motionStatus);
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





function sendData(data, lightNumber) {
  if (motionStatusList[lightNumber] === true) {
    data = JSON.stringify(data);
    console.log("Sending data to lamp: "+data);
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
