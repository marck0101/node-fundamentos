// Importa o módulo 'http' da biblioteca padrão do Node.js para criar um servidor HTTP.
import http from 'node:http';

// Importa o middleware 'json' para tratar requisições e respostas em formato JSON.
import { json } from './middlewares/json.js';

// Importa as rotas definidas no arquivo 'routes.js'.
import { routes } from './routes.js';

// Importa a função 'extractQueryParams' do utilitário 'extract-query-params.js' para extrair parâmetros da consulta.
import { extractQueryParams } from './utils/extract-query-params.js';

// Cria um servidor HTTP usando o módulo 'http'.
const server = http.createServer(async (req, res) => {
  // Extrai o método e a URL da requisição.
  const { method, url } = req;

  // Chama o middleware 'json' para tratar requisições e respostas em formato JSON.
  await json(req, res);

  // Encontra a rota correspondente ao método e à URL da requisição.
  const route = routes.find(route => {
    return route.method === method && route.path.test(url);
  });

  // Se a rota existe, executa o manipulador (handler) correspondente.
  if (route) {
    // Obtém parâmetros da URL usando a expressão regular definida na rota.
    const routeParams = req.url.match(route.path);

    // Extrai os grupos da expressão regular, que representam os parâmetros da rota.
    const { query, ...params } = routeParams.groups;

    // Define os parâmetros e a consulta na requisição para uso posterior.
    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    // Chama o manipulador (handler) da rota.
    return route.handler(req, res);
  }

  // Se a rota não existe, retorna uma resposta 404 (Not Found).
  return res.writeHead(404).end();
});

// O servidor escuta na porta 3333.
server.listen(3333);
