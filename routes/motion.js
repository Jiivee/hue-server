var express = require('express');
var router = express.Router();
var request = require('request');

var constants = require('../constants');

var lastMovement;
var movement;
var timeNow;


//These can be changed by the user
var lightTime = 5000;
var motionStatusList = [true, true, true, true, true, true];
var motionSetting = "switch" //Timer or switch

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
      if(body.on) {
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

/* Get motion status */
router.post('/', function(req, res, next) {
  res.send('Motion message received');
  var on = parseInt(req.body.on);
  console.log("Current motion status: "+on);
  if (on === 1) {
    movement = true;
    for(lightNumber = 0; lightNumber < motionStatusList.length; lightNumber++){
      console.log("looping througs lights, current: "+lightNumber);
      console.log("motion status "+motionStatusList[lightNumber] );
      if(motionStatusList[lightNumber] && !isLightOn(lightNumber+1)){
        sendData(dataOn, lightNumber+1); //Philips hue lights are numbered 1-6
      }
      else if(motionStatusList[lightNumber] && motionSetting === "switch" && Date.now() - lastMovement > 2000 && (lightNumber)){
        sendData(dataOff);
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
  lightNumberList = req.body.lights;
  motionStatus = req.body.motionStatus;
  lightNumberList.forEach(function(lightNumber) {
    if(motionStatus === 'true'){
      motionStatusList[lightNumber-1] = true;
    }
    else {
      motionStatusList[lightNumber-1] = false;
    }
  })
});


var timer = setInterval(function() {
  timeNow = Date.now();
  for(lightNumber = 0; lightNumber < motionStatusList.length; lightNumber++){
    if (timeNow - lastMovement > lightTime && movement === false && motionSetting === "timer" && motionStatusList(lightNumber) && isLightOn(lightNumber+1)) {
      sendData(dataOff, lightNumber);
    }
  }
}, 2000);


function sendData(data, lightNumber) {
  if (motionStatus === true) {
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
