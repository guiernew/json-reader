const path = require('path');
const fs = require('fs');
const nReadlines = require('n-readlines');

const filesDirectory = './files'

const directoryPath = path.join(__dirname, filesDirectory);
fs.readdir(directoryPath, function (err, paths) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  paths.forEach(path => {
    const fullpath = filesDirectory + '/' + path;

    const broadbandLines = new nReadlines(fullpath);

    let line;
    let fullText = '';

    while (line = broadbandLines.next()) {
      fullText += line.toString('utf8') + ','
    }

    fullText = '[' + fullText + ']';

    fullText = fullText.replace(',]', ']')

    fs.writeFile(fullpath, fullText, 'utf8', function (err) {
      if (err) {
        console.log('Erro gay viado!', path);
      }
      console.log('Sucesso gay viado!', path);
    });
  })
}); 