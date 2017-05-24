// GET /people will return all active people. See https://github.com/floatschedule/api/blob/master/Sections/people.md

'use strict';
module.exports = getPeople;

const https = require('https');
const fs = require('fs');

function getPeople() {
  
  var options = {
    hostname: 'api.float.com',
    port: 443,
    path: '/api/v1/people',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer YOUR_BEARER_TOKEN',
      'User-Agent': 'YOUR_REQUESTING_USER'
    }
  };

  var req = https.request(options, (res) => {
    var responseBody = '';
    res.on('data', (chunk) => {
      responseBody += chunk;
    });

    res.on('end', () => {
      fs.writeFile('./people/people.json', responseBody, (err) => {
        if (err) {
          throw err;
        } 
        console.log('Response Complete');
      });
    });
  });

  req.on('error', (err) => {
    console.log(`${err.message}`);
  });

  req.end();
}

getPeople();
