const axios = require('axios');
const path = require('path');
const fs = require('fs');

const filesDirectory = './files'

const autenticacao = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'CHAVE_DO_CLIENTE',
  'APIKey': 'imseeyouractions'
}

const url = 'https://sandbox.api.customerx.com.br/api/v1/timelines'

const directoryPath = path.join(__dirname, filesDirectory);
fs.readdir(directoryPath, function (err, paths) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  paths.forEach(path => {
    try {
      console.log('Abrindo arquivo: ' + path);
      const items = require(filesDirectory + '/' + path);

      console.log('Quantidade: ' + items.length);

      const filtereItems = items.filter(nota =>
        nota.type.caption.includes('Tarefa') ||
        nota.type.caption.includes('Reunião')
      )
        .map(nota => ({
          external_id_client: nota.customer.id_legacy,
          title: nota.description,
          body: nota.notes,
          created_at: nota.end_date,
          operation: "client_notes",
          user_id: 686
        }))


      console.log('Quantidade filtrada: ' + filtereItems.length);

      const size = filtereItems.length;

      filtereItems.forEach((item, index) => {
        axios.post(url, item, { headers: autenticacao })
          .then(res => {
            console.log('Sucesso: ' + index + '/' + size);
          })
          .catch(err => {
            console.error('Error no item posição: ' + index, err.message);
          });
      })

      console.log('Fechando arquivo: ' + path);
    } catch (error) {
      console.error('Erro no arquivo: ' + path, error)
    }
  })
});

