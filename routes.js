// Importa a função randomUUID do módulo 'crypto' para gerar IDs únicos.
import { randomUUID } from 'node:crypto';

// Importa a classe Database do arquivo 'database.js' para interagir com o banco de dados.
import { Database } from './database.js';

// Importa a função buildRoutePath do utilitário 'build-route-path.js' para construir caminhos de rota.
import { buildRoutePath } from './utils/build-route-path.js';

// Cria uma instância da classe Database para interagir com o banco de dados.
const database = new Database();

// Exporta um array de objetos que representam definições de rota para o servidor HTTP.
export const routes = [
  {
    // Rota para lidar com requisições GET em '/users'.
    method: 'GET',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      // Extrai o parâmetro 'search' da consulta da requisição.
      const { search } = req.query;

      // Seleciona usuários do banco de dados com base no parâmetro de busca.
      const users = database.select('users', search ? {
        name: search,
        email: search
      } : null);

      // Retorna a lista de usuários em formato JSON na resposta.
      return res.end(JSON.stringify(users));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const { name, email } = req.body

      const user = {
        id: randomUUID(),
        name,
        email,
      }

      database.insert('users', user)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { name, email } = req.body

      database.update('users', id, {
        name,
        email,
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('users', id)

      return res.writeHead(204).end()
    }
  }
]
