const axios = require('axios');
const path = require('path');
const fs = require('fs');

const filesDirectory = './files_aguardando'

const directoryPath = path.join(__dirname, filesDirectory);
fs.readdir(directoryPath, function (err, paths) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  paths.forEach(path => {
    fs.rename(filesDirectory + '/' + path, filesDirectory + '/' + path.replace('.txt', '.json'), function(err) {
        if ( err ) console.log('ERROR: ' + err);
    });
  })
});

