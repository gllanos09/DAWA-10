import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import { IoArrowBack, IoTv } from "react-icons/io5";
import { Character, Episode } from "@/types/character";
import { fetchJson, NotFoundError } from "@/lib/api";

const API_URL = "https://rickandmortyapi.com/api/character";
const PRERENDERED_CHARACTERS = 100;

// Perfil de caché: revalidación cada 10 días (ISR)
const CHARACTER_CACHE = {
  stale: 86400, // 1 día en el router del cliente
  revalidate: 864000, // 10 días: regeneración en segundo plano
  expire: 1728000, // 20 días: máximo antes de regenerar de forma bloqueante
};

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

const statusColors: Record<string, string> = {
  Alive: "bg-emerald-500",
  Dead: "bg-red-500",
  unknown: "bg-slate-500",
};

async function getCharacter(id: string): Promise<Character | null> {
  "use cache";
  cacheLife(CHARACTER_CACHE);

  try {
    return await fetchJson<Character>(`${API_URL}/${id}`);
  } catch (error) {
    if (error instanceof NotFoundError) return null;
    throw error;
  }
}

async function getEpisodes(urls: string[]): Promise<Episode[]> {
  "use cache";
  cacheLife(CHARACTER_CACHE);

  if (urls.length === 0) return [];

  const ids = urls.map((url) => url.split("/").pop()).join(",");

  try {
    const data = await fetchJson<Episode | Episode[]>(
      `https://rickandmortyapi.com/api/episode/${ids}`
    );
    return Array.isArray(data) ? data : [data];
  } catch {
    return []; // Los episodios son complementarios: no deben romper la página
  }
}

export async function generateStaticParams() {
  // Prerenderizamos los primeros 100 personajes (SSG).
  // El resto se genera bajo demanda en la primera visita y queda cacheado (ISR).
  return Array.from({ length: PRERENDERED_CHARACTERS }, (_, index) => ({
    id: (index + 1).toString(),
  }));
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) {
    return { title: "Personaje no encontrado - Rick and Morty" };
  }

  return {
    title: `${character.name} - Rick and Morty`,
    description: `Información de ${character.name}: ${character.species}, ${character.status}`,
  };
}

export default async function CharacterDetail({ params }: CharacterPageProps) {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) notFound();

  const episodes = await getEpisodes(character.episode);

  const info = [
    { label: "Estado", value: character.status },
    { label: "Especie", value: character.species },
    { label: "Tipo", value: character.type || "Desconocido" },
    { label: "Género", value: character.gender },
    { label: "Origen", value: character.origin.name },
    { label: "Ubicación actual", value: character.location.name },
    { label: "Episodios", value: character.episode.length.toString() },
    {
      label: "Creado",
      value: new Date(character.created).toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }),
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-linear-to-r from-slate-900 to-emerald-700 p-8">
          <h1 className="text-5xl font-bold text-white text-center">
            {character.name}
          </h1>
          <p className="text-emerald-200 text-center text-xl mt-2">
            #{character.id.toString().padStart(3, "0")}
          </p>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex justify-center items-start">
              <Image
                width={400}
                height={400}
                src={character.image}
                alt={character.name}
                className="w-72 h-72 rounded-2xl object-cover shadow-lg"
                priority
              />
            </div>

            <div className="flex-1 text-slate-700">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-3">Estado</h3>
                <span
                  className={`${
                    statusColors[character.status] ?? "bg-slate-400"
                  } text-white px-4 py-2 rounded-full font-semibold`}
                >
                  {character.status} — {character.species}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-3">Información</h3>
              <div className="space-y-2">
                {info.map((item) => (
                  <p key={item.label}>
                    <strong>{item.label}:</strong> {item.value}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 text-slate-700">
            <h3 className="text-2xl font-bold mb-3">
              <IoTv size={26} className="inline-block mr-2" />
              Apariciones
            </h3>
            <div className="flex flex-wrap gap-2">
              {episodes.map((episode) => (
                <span
                  key={episode.id}
                  className="bg-slate-100 border border-slate-200 text-sm px-3 py-1 rounded-lg"
                  title={episode.name}
                >
                  {episode.episode} · {episode.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50">
          <Link
            href="/characters"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            <IoArrowBack size={20} />
            Volver a la lista
          </Link>
        </div>
      </div>
    </div>
  );
}