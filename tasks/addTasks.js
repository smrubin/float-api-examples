'use strict';

const querystring = require('querystring');
const jsonExport = require('./path/to/export.json');
const requestPost = require('../requestPost');
const async = require('async');
const currentPeople = require('../people/people.json');
const currentProjects = require('../projects/projects.json');

const mergeDate = new Date('09/01/2016');
var tasks = {};

// Note: Cannot assign more than 24 hours to an individual, even if a TBD role

// Filter current tasks to only include those after the merge date and with a user and project currently in Float; and have more than 0 hours. Then map each row to a new tasks object, with unique properties for each unique task (discriminated by project, person, and phase).
jsonExport
  .filter( (row) => {
    let date = new Date(row.date);
    return (date < mergeDate || getPersonId(row['full name']) === '' || getProjectId(row['project name']) === '' || row['scheduled (hours)'] === 0 );
  })
  .forEach( (row) => {
    let phase = ( row.phase_name === '[Non Phase Specific]' ) ? '' : row.phase_name;
    let taskDiscriminator = row['full name'].concat(row['project name'], phase);

    if (tasks[taskDiscriminator]) {
      tasks[taskDiscriminator].dates.push(new Date(row.date));
    } else {
      tasks[taskDiscriminator] = {
        'person': row['full name'],
        'project': row['project name'],
        'phase': phase,
        'dates': [new Date(row.date)],
        'hours_pd': row['scheduled (hours)']
      };
    }
  });

console.log(`Ready to add... ${Object.keys(tasks).length} tasks`); // total # of tasks to be added

// iterate over tasks object to make each post request
async.forEachSeries(Object.keys(tasks), function(taskDiscriminator, callback) {
  let task = tasks[taskDiscriminator];
  let startDate = formatDate(new Date(Math.min.apply(null, task.dates)));
  let endDate = formatDate(new Date(Math.max.apply(null, task.dates)));
  let personId = getPersonId(task.person);
  let projectId = getProjectId(task.project);

  let postTask = querystring.stringify({
    'task_name': task.phase,
    'people_id': personId,
    'project_id': projectId,
    'start_date': startDate,
    'end_date': endDate,
    'hours_pd': task.hours_pd
  });

  // Make POST request with postTask
  console.log(`\nAdding task for ${task.person} on ${task.project}`);
  callback();
  requestPost(postTask, 'tasks', callback);

}, function(err) {
  if( err ) {
    console.log('A request failed to process');
  } else {
    console.log('--addTasks Process Complete--');
  }
});

function getPersonId(personName) {
  var personId = '';
  currentPeople.people.some( (person) => {
    if( person.name === personName) {
      personId = person.people_id;
      return true;
    }
  });
  return personId;
}

function getProjectId(projectName) {
  var projectId = '';
  currentProjects.projects.some( (project) => {
    if( project.project_name === projectName) {
      projectId = project.project_id;
      return true;
    }
  });
  return projectId;
}

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
  if (month.length < 2) { month = '0' + month; }
  if (day.length < 2) { day = '0' + day; }
  return [year, month, day].join('-');
}
