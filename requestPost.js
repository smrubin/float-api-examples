'use strict';
const https = require('https');

module.exports = requestPost;

function requestPost(postData, api, callback) {

  var options = {
    hostname: 'api.float.com',
    port: 443,
    path: '/api/v1/' + api,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer YOUR_BEARER_TOKEN',
      'User-Agent': 'YOUR_REQUESTING_USER',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  var req = https.request(options, (res) => {
    res.setEncoding('utf8');
    var responseBody = '';

    res.on('data', (chunk) => {
      responseBody += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        callback();
      } else {
        console.log('Server status error: ', res.statusCode);
      }
    });
  });

  req.on('error', (err) => {
    console.log(`${err.message}`);
  });

  req.write(postData);
  req.end();
}
