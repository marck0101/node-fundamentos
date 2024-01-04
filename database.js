// Importa o módulo 'fs/promises' da biblioteca padrão do Node.js para operações de sistema de arquivos assíncronas.
import fs from 'node:fs/promises';

// Cria uma instância da classe URL para obter o caminho completo do arquivo 'db.json' em relação ao diretório atual do script.
const databasePath = new URL('../db.json', import.meta.url);

// Exporta a classe Database para que ela possa ser usada em outros módulos.
export class Database {
  // Declara uma propriedade privada chamada #database para armazenar os dados do banco de dados.
  #database = {};

  // Construtor da classe Database.
  constructor() {
    // Lê o conteúdo do arquivo 'db.json' em formato utf-8.
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        // Parseia os dados do arquivo JSON e atribui ao #database.
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        // Se houver um erro ao ler o arquivo (por exemplo, se não existir), chama o método #persist.
        this.#persist();
      });
  }

  // Método privado #persist para escrever os dados do #database de volta para o arquivo 'db.json'.
  #persist() {
    // Escreve os dados do #database de volta para o arquivo JSON.
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  // Método público select para recuperar dados de uma tabela com opção de pesquisa.
  select(table, search) {
    // Obtém os dados da tabela ou um array vazio se a tabela não existir.
    let data = this.#database[table] ?? [];

    // Filtra os dados com base nas condições de pesquisa, se fornecidas.
    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    // Retorna os dados filtrados.
    return data;
  }

  // Método público insert para adicionar um novo registro à tabela.
  insert(table, data) {
    // Verifica se a tabela existe e adiciona o novo dado a ela, ou cria uma nova tabela.
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    // Chama o método #persist para salvar as alterações no arquivo 'db.json'.
    this.#persist();

    // Retorna o dado inserido.
    return data;
  }

  // Método público update para modificar um registro existente na tabela.
  update(table, id, data) {
    // Encontra o índice do registro com base no ID.
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    // Se o registro existe, atualiza os dados e chama o método #persist.
    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data };
      this.#persist();
    }
  }

  // Método público delete para remover um registro da tabela com base no ID.
  delete(table, id) {
    // Encontra o índice do registro com base no ID.
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    // Se o registro existe, remove-o e chama o método #persist.
    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
