// Exporta a função buildRoutePath que constrói uma expressão regular a partir de um caminho de rota.
export function buildRoutePath(path) {
  // Define uma expressão regular para encontrar parâmetros na rota, por exemplo, ':id'.
  const routeParametersRegex = /:([a-zA-Z]+)/g;

  // Substitui os parâmetros da rota por expressões regulares capturadoras.
  const paramsWithParams = path.replace(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)');

  // Cria uma expressão regular para validar o caminho da rota, permitindo uma string de consulta opcional.
  const pathRegex = new RegExp(`^${paramsWithParams}(?<query>\\?(.*))?$`);

  // Retorna a expressão regular resultante.
  return pathRegex;
}