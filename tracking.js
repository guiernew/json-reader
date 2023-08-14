const axios = require('axios');
const path = require('path');
const fs = require('fs');
const excelToJson = require('convert-excel-to-json');

const filesDirectory = './files'

const autenticacao = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'credential': 'ba98764aff7c636eb5918f90dfbf5509',
  'key': 'ecd4786a1d7c256a7379db72f116ac2b'
}

const url = 'https://tracker.customerx.com.br'

const directoryPath = path.join(__dirname, filesDirectory);
fs.readdir(directoryPath, function (err, paths) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  paths.forEach(path => {
    try {
      
      const erros = []
      console.log('Abrindo arquivo: ' + path);
      const result = excelToJson({
        sourceFile: (filesDirectory + '/' + path),
        header:{
          rows: 1
      },
        columnToKey: {
          A: 'external_id_client',
          B: 'date_tracking',
          C: 'amount',
          D: 'identifier',
          E: 'type_tracking',
          F: 'email'
      }
    });

      const items = result.in;
      console.log('Quantidade: ' + items.length);
      return;
      const filtereItems = items
      //.filter(nota =>
       // nota.type.caption.includes('Tarefa') ||
       // nota.type.caption.includes('Reunião')
      //)
       // .map(nota => ({
       //   external_id_client: nota.customer.id_legacy,
        ///  title: "anotação do sense",
         // body: nota.description,
         // created_at: nota.created_on,
         // operation: "client_note",
         // user_id: 4826
        //}))


      console.log('Quantidade filtrada: ' + filtereItems.length);

      const size = filtereItems.length;

      filtereItems.forEach((item, index) => {
        //if (![29,32,40,37,46,55,57,69,73,83,82,84,95,111,114,115,117,64,68,100,103,108,110].includes(index)){return}
        axios.post(url, item, { headers: autenticacao })
          .then(res => {
            console.log('Sucesso: ' + (index+1) +  '/' + size);
          })
          .catch(err => {
           
            console.error('Error no item posição: ' + index, err.data);
          });
      })

      console.log('Fechando arquivo: ' + path);
    } catch (error) {
      console.error('Erro no arquivo: ' + path, error)
    }
  })
});

