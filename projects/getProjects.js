// GET /projects will return all active projects. See https://github.com/floatschedule/api/blob/master/Sections/projects.md

'use strict';

module.exports = getProjects;

const https = require('https');
const fs = require('fs');

function getProjects() {

  var options = {
    hostname: 'api.float.com',
    port: 443,
    path: '/api/v1/projects',
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
      fs.writeFile('./projects/projects.json', responseBody, (err) => {
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
  
getProjects();
