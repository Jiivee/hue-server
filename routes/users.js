var express = require('express');
var router = express.Router();
var request = require('request');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  console.log('hello');
  request({
    method: 'PUT',
    body: '{"on":true, "sat":254, "bri":254,"hue":0}',
    uri: 'http://192.168.1.7/api/GYRwirkQ698vzLpqkUe-gEu2wkWMxPZg6bjzZukI/lights/6/state'
  },
  function (error, response, body) {
    console.log(response.body);
    if (!error && response.statusCode == 200) {
      console.log(body) // Print the google web page.
    }
  })
});

module.exports = router;
