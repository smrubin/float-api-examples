// GET /tasks will return all active tasks that occur within a given time period. Default time period is 13 weeks. Default start period is the first full week prior to the start day, which defaults to today, if no attribute is passed. See https://github.com/floatschedule/api/blob/master/Sections/tasks.md

'use strict';

module.exports = getTasks;

const https = require('https');
const fs = require('fs');

function getTasks() {
  
  var options = {
    hostname: 'api.float.com',
    port: 443,
    path: '/api/v1/tasks',
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
      fs.writeFile('./tasks/tasks.json', responseBody, (err) => {
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

getTasks();
