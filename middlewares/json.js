// Exporta a função json que será usada como middleware.
export async function json(req, res) {
  // Inicializa um array para armazenar os chunks (pedaços) do corpo da requisição.
  const buffers = [];

  // Itera sobre os chunks do corpo da requisição utilizando um loop for-await-of.
  for await (const chunk of req) {
    buffers.push(chunk);
  }

  // Tenta analisar o corpo da requisição como JSON.
  try {
    // Concatena os buffers para obter o corpo completo e o converte para uma string.
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    // Se ocorrer um erro ao analisar o JSON, define req.body como null.
    req.body = null;
  }

  // Configura o cabeçalho da resposta para indicar que o conteúdo é JSON.
  res.setHeader('Content-type', 'application/json');
}
 