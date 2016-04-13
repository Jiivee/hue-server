var express = require('express');
var router = express.Router();
var request = require('request');


/* GET users listing. */
router.post('/', function(req, res, next) {
  res.send('Motion message received');
  console.log(req.body);
  var on = parseInt(req.body.on);
  var data;
  if (on === 1) {
    data = {
      "on": true
    };
  }
  else {
    data = {
      "on": false
    };
  }

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

module.exports = router;
