import { cacheLife } from "next/cache";
import {
  Character,
  CharacterListResponse,
  Episode,
  EpisodeListResponse,
} from "@/types/character";
import { fetchJson, NotFoundError } from "@/lib/api";

const CHARACTER_URL = "https://rickandmortyapi.com/api/character";
const EPISODE_URL = "https://rickandmortyapi.com/api/episode";

export const BATCH_SIZE = 20;

// Perfil de caché: revalidación cada 10 días (ISR)
const TEN_DAYS = {
  stale: 86400, // 1 día en el router del cliente
  revalidate: 864000, // 10 días: regeneración en segundo plano
  expire: 1728000, // 20 días: máximo antes de regenerar de forma bloqueante
};

/** Lista completa de personajes, paginada de 20 en 20 (SSG). */
export async function getAllCharacters(): Promise<Character[]> {
  "use cache";
  cacheLife("max"); // El catálogo casi no cambia

  const firstPage = await fetchJson<CharacterListResponse>(CHARACTER_URL, {
    cache: "force-cache", // Forzamos el caché en la petición
  });

  const pages: CharacterListResponse[] = [firstPage];

  for (let page = 2; page <= firstPage.info.pages; page++) {
    pages.push(
      await fetchJson<CharacterListResponse>(`${CHARACTER_URL}?page=${page}`, {
        cache: "force-cache",
      })
    );
  }

  return pages.flatMap((page) => page.results);
}

/**
 * Trae un lote de 20 personajes en UNA sola petición (/api/character/1,2,3...).
 * Al estar cacheado, las 20 páginas de detalle de ese rango comparten la misma llamada.
 */
async function getCharacterBatch(startId: number): Promise<Character[]> {
  "use cache";
  cacheLife(TEN_DAYS);

  const ids = Array.from({ length: BATCH_SIZE }, (_, index) => startId + index);

  try {
    const data = await fetchJson<Character | Character[]>(
      `${CHARACTER_URL}/${ids.join(",")}`
    );
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    if (error instanceof NotFoundError) return [];
    throw error;
  }
}

/** Devuelve un personaje por Id, o null si no existe. */
export async function getCharacterById(id: number): Promise<Character | null> {
  if (!Number.isInteger(id) || id < 1) return null;

  const startId = Math.floor((id - 1) / BATCH_SIZE) * BATCH_SIZE + 1;
  const batch = await getCharacterBatch(startId);

  return batch.find((character) => character.id === id) ?? null;
}

/** Los 51 episodios en una sola petición, compartida por todas las páginas. */
export async function getAllEpisodes(): Promise<Episode[]> {
  "use cache";
  cacheLife(TEN_DAYS);

  const firstPage = await fetchJson<EpisodeListResponse>(EPISODE_URL);
  const pages: EpisodeListResponse[] = [firstPage];

  for (let page = 2; page <= firstPage.info.pages; page++) {
    pages.push(
      await fetchJson<EpisodeListResponse>(`${EPISODE_URL}?page=${page}`)
    );
  }

  return pages.flatMap((page) => page.results);
}

/** Filtra en memoria los episodios de un personaje a partir de sus URLs. */
export async function getEpisodesFor(urls: string[]): Promise<Episode[]> {
  if (urls.length === 0) return [];

  const ids = new Set(urls.map((url) => Number(url.split("/").pop())));

  try {
    const episodes = await getAllEpisodes();
    return episodes.filter((episode) => ids.has(episode.id));
  } catch {
    return []; // Los episodios son complementarios: no deben romper la página
  }
}