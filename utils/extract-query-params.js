// Exporta a função extractQueryParams que extrai parâmetros de uma string de consulta (query) em uma URL.
export function extractQueryParams(query) {
  // Remove o caractere '?' do início da string de consulta e a divide em pares de chave e valor usando '&'.
  return query.substr(1).split('&').reduce((queryParams, param) => {
    // Para cada parâmetro, divide a string em chave e valor usando '='.
    const [key, value] = param.split('=');

    // Atribui a chave e o valor ao objeto queryParams.
    queryParams[key] = value;

    // Retorna o objeto queryParams atualizado.
    return queryParams;
  }, {}); // Inicializa o objeto queryParams como um objeto vazio.
}