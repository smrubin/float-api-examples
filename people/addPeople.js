'use strict';

const querystring = require('querystring');
const jsonExport = require('./path/to/export.json');
const requestPost = require('../requestPost');
const async = require('async');
const currentPeople = require('./people.json');


// IDs come from Float (retrieved via a GET). Manual config object.
const departments = {};

var flags = {};

// Add current people in Float to the flags object
currentPeople.people.forEach( (person) => {
  flags[person.name] = true;
});

// Filter array to only include unique instances of a person's name based on the 'Full Name' field
var people = jsonExport.filter( (row) => {
  if (flags[row['full name']] || row['full name'] === '') {
    return false;
  }

  flags[row['full name']] = true;
  return true;
});

console.log(`Ready to add... ${people.length} people`); // total # of people to be added

async.forEachSeries(people, function(person, callback) {
  
  let departmentId = getIdByDepartment(person.discipline);

  let postPerson = querystring.stringify({
    'name': person['full name'],
    'job_title': person.role,
    'email': person.email,
    'department_id': departmentId
  });

  // Make POST request with postPerson
  console.log(`\nAdding ${person['full name']}`);
  requestPost(postPerson, 'people', callback);

}, function(err) {
  if( err ) {
    console.log('A request failed to process');
  } else {
    console.log('--addPeople Process Complete--');
  }
});

function getIdByDepartment(departmentName) {
  return departments[departmentName];
}