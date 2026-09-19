/**
 * Seu backend retorna: { mensagem: "...", erro: [{ path: ["campo"], message: "..." }] }
 * Convertemos para { campo: "mensagem" } pra destacar os inputs.
 */
export function parseFieldErrors(error) {
  const data = error?.response?.data;
  const fields = {};
  const list = Array.isArray(data?.erro)
    ? data.erro
    : Array.isArray(data?.errors) // fallback, caso alguma rota use o padrão "errors"
    ? data.errors
    : [];

  list.forEach((issue) => {
    const path = issue?.path;
    const key = Array.isArray(path) ? path[path.length - 1] : path;
    if (key && !fields[key]) fields[key] = issue.message;
  });

  return fields;
}

export function getErrorMessage(error, fallback = 'Algo deu errado. Tente novamente.') {
  const data = error?.response?.data;
  if (typeof data?.message === 'string') return data.message;
  if (typeof data?.mensagem === 'string') return data.mensagem;
  if (typeof data?.error === 'string') return data.error;
  if (typeof data?.erro === 'string') return data.erro; // erros 500 de categoria/jogo
  if (Array.isArray(data?.erro) && data.erro[0]?.message) return data.erro[0].message;
  if (error?.code === 'ERR_NETWORK') {
    return 'Não foi possível conectar à API. Ela está rodando em http://localhost:3000?';
  }
  return fallback;
}