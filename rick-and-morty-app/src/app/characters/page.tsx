import Link from "next/link";
import Image from "next/image";
import { IoList } from "react-icons/io5";
import { Character, CharacterListResponse } from "@/types/character";

const API_URL = "https://rickandmortyapi.com/api/character";

const statusColors: Record<string, string> = {
  Alive: "bg-emerald-500",
  Dead: "bg-red-500",
  unknown: "bg-slate-500",
};

async function getAllCharacters(): Promise<Character[]> {
  // Forzamos el caché: la respuesta se guarda en el build y no se vuelve a pedir (SSG)
  const res = await fetch(API_URL, { cache: "force-cache" });

  if (!res.ok) throw new Error("Error al cargar los personajes");

  const firstPage: CharacterListResponse = await res.json();

  // El API pagina de 20 en 20; pedimos las páginas restantes en paralelo
  const otherPages = await Promise.all(
    Array.from({ length: firstPage.info.pages - 1 }, async (_, index) => {
      const pageRes = await fetch(`${API_URL}?page=${index + 2}`, {
        cache: "force-cache",
      });

      if (!pageRes.ok) throw new Error("Error al cargar los personajes");

      const page: CharacterListResponse = await pageRes.json();
      return page.results;
    })
  );

  return [firstPage.results, ...otherPages].flat();
}

export default async function CharacterList() {
  const characters = await getAllCharacters();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-left mb-2 drop-shadow-lg">
          <IoList size={40} className="inline-block" /> Lista de Personajes (SSG)
        </h1>
        <p className="text-slate-400 mb-12">
          {characters.length} personajes generados estáticamente en el build.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map((character) => (
            <Link
              key={character.id}
              href={`/characters/${character.id}`}
              className="transform transition hover:scale-105"
            >
              <div className="bg-white text-slate-700 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer h-full">
                <Image
                  width={300}
                  height={300}
                  src={character.image}
                  alt={character.name}
                  className="w-full h-56 object-cover"
                  loading="lazy" // Carga la imagen bajo demanda (Lazy Loading)
                  priority={false}
                />

                <div className="p-4">
                  <h2 className="text-lg font-bold truncate">{character.name}</h2>
                  <p className="text-slate-500 text-sm mb-2">
                    #{character.id.toString().padStart(3, "0")} · {character.species}
                  </p>
                  <span
                    className={`${
                      statusColors[character.status] ?? "bg-slate-400"
                    } text-white text-xs px-3 py-1 rounded-full font-semibold`}
                  >
                    {character.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}