const axios = require('axios');
const path = require('path');
const fs = require('fs');

const filesDirectory = './files'

const autenticacao = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': '9c6aa63a2e0e84bfa830d009208b9589',
  'APIKey': 'imseeyouractions'
}

const url = 'https://api.customerx.com.br/api/v1/timelines'

const directoryPath = path.join(__dirname, filesDirectory);
fs.readdir(directoryPath, function (err, paths) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  paths.forEach(path => {
    try {
      
      const erros = []
      console.log('Abrindo arquivo: ' + path);
      const items = require(filesDirectory + '/' + path);

      console.log('Quantidade: ' + items.length);

      const filtereItems = items
      .filter(nota =>
      nota.type.caption.includes('Playbook') ||
      nota.type.caption.includes('Ligação') ||
      nota.type.caption.includes('Email')
      )
        .map(nota => ({
          external_id_client: nota.customer.id_legacy,
          title: "Importação SenseData",
          body: nota.description,
          created_at: nota.created_on,
          operation: "client_note",
          user_id: 4826
        }))


      console.log('Quantidade filtrada: ' + filtereItems.length);

      const size = filtereItems.length;

      filtereItems.forEach((item, index) => {
        //if (![29,32,40,37,46,55,57,69,73,83,82,84,95,111,114,115,117,64,68,100,103,108,110].includes(index)){return}
        axios.post(url, item, { headers: autenticacao })
          .then(res => {
            console.log('Sucesso: ' + index + '/' + size);
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

