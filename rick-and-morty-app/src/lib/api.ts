const MAX_RETRIES = 5;
const MIN_GAP_MS = 150; // Separación mínima entre peticiones al mismo API

export class NotFoundError extends Error {
  constructor(url: string) {
    super(`Recurso no encontrado: ${url}`);
    this.name = "NotFoundError";
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Cola secuencial: encadena las peticiones de este proceso para que nunca
 * salgan dos a la vez y siempre haya una pausa mínima entre ellas.
 */
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const result = queue.then(task, task);
  queue = result.then(() => wait(MIN_GAP_MS), () => wait(MIN_GAP_MS));
  return result;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      // Backoff exponencial: 1s, 2s, 4s, 8s
      await wait(1000 * 2 ** (attempt - 1));
    }

    const res = await fetch(url, init);

    if (res.status === 404) throw new NotFoundError(url);

    const contentType = res.headers.get("content-type") ?? "";

    if (res.ok && contentType.includes("application/json")) {
      return (await res.json()) as T;
    }

    if (res.status === 429) {
      // Respetamos la cabecera Retry-After cuando el API la envía
      const retryAfter = Number(res.headers.get("retry-after"));
      if (Number.isFinite(retryAfter) && retryAfter > 0) {
        await wait(Math.min(retryAfter, 30) * 1000);
      }
    }

    const preview = (await res.text()).slice(0, 100).replace(/\s+/g, " ");
    lastError = new Error(
      `Respuesta inválida de ${url} — status ${res.status}, content-type ${contentType}. ${preview}`
    );
  }

  throw lastError;
}

export function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  return enqueue(() => request<T>(url, init));
}