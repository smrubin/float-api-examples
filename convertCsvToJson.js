// Converts a csv file to a json array
'use strict';

const fs = require('fs');
const Converter = require('csvtojson').Converter;
const converter = new Converter({});

// end_parsed will be emitted once parsing is finished
converter.on('end_parsed', (jsonArray) => {
  let jsonString = JSON.stringify(jsonArray);
  // select path and name of new json file
  fs.writeFile('./export.json', jsonString, (err) => {
    if (err) {
      throw err;
    } 
    console.log('CSV to JSON Complete');
  });
});

fs.createReadStream('./path/to/csv/file.csv').pipe(converter);
