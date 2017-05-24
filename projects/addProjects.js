'use strict';

const querystring = require('querystring');
const jsonExport = require('./path/to/export.json');
const requestPost = require('../requestPost');
const async = require('async');
const currentProjects = require('./projects.json');

// IDs come from Float (retrieved via a GET)
const clients = {
  'Client1': '12345',
};

var flags = {};

// Add current projects in Float to the flags object
currentProjects.projects.forEach( (project) => {
  flags[project.project_name] = true;
});

// Filter array to only include unique instances of a project based on the 'Project Name' field
var projects = jsonExport.filter( (row) => {
  if (flags[row['project name']] || row['project status'] === 'Archived' || row['project name'] === '') {
    return false;
  }

  flags[row['project name']] = true;
  return true;
});

console.log(`Ready to add... ${projects.length} projects`); // total # of projects to be added

async.forEachSeries(projects, function(project, callback) {

  let clientId = getIdByClient(project['client name']);

  let postProject = querystring.stringify({
    'project_name': project['project name'],
    'client_id': clientId,
    'description': '',
    'active': 1, // default for all imported projects
    'non_billable': inverse(project.billable),
    'tentative': getProjectStateBoolean(project['project state'])
  });

  // Make POST request with postProject
  console.log(`\nAdding ${project['project name']}`);
  requestPost(postProject, 'projects', callback);

}, function(err) {
  if( err ) {
    console.log('A request failed to process');
  } else {
    console.log('--addProjects Process Complete--');
  }
});

function inverse(flag) {
  return 1 - flag;
}

function getIdByClient(clientName) {
  return clients[clientName];
}

function getProjectStateBoolean(state) {
  return (state === 'Tentative') ? 1 : 0;
}
