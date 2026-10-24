"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoSearch, IoWarningOutline, IoRefresh } from "react-icons/io5";
import { Character, CharacterListResponse, CharacterFilters } from "@/types/character";

const API_URL = "https://rickandmortyapi.com/api/character";

const statusColors: Record<string, string> = {
  Alive: "bg-emerald-500",
  Dead: "bg-red-500",
  unknown: "bg-slate-500",
};

const initialFilters: CharacterFilters = {
  name: "",
  status: "",
  type: "",
  gender: "",
};

export default function CharacterSearch() {
  const [filters, setFilters] = useState<CharacterFilters>(initialFilters);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    // Debounce: espera 400 ms desde la última tecla antes de consultar el API
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters.name) params.set("name", filters.name);
        if (filters.status) params.set("status", filters.status);
        if (filters.type) params.set("type", filters.type);
        if (filters.gender) params.set("gender", filters.gender);

        const res = await fetch(`${API_URL}?${params.toString()}`, {
          signal: controller.signal,
        });

        if (res.status === 404) {
          setCharacters([]);
          setTotal(0);
          setError("No se encontraron personajes con esos criterios.");
          return;
        }

        if (!res.ok) throw new Error("Error al consultar el API");

        const data: CharacterListResponse = await res.json();
        setCharacters(data.results);
        setTotal(data.info.count);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Ocurrió un error al realizar la búsqueda.");
        setCharacters([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters]);

  const handleChange = (field: keyof CharacterFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          <IoSearch size={40} className="inline-block" /> Búsqueda de Personajes (CSR)
        </h1>
        <p className="text-slate-400 mb-8">
          Los resultados se consultan desde el navegador con useState y useEffect.
        </p>

        <div className="bg-white/5 border border-emerald-500/20 rounded-xl p-6 mb-10 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-slate-300 text-sm mb-2">Nombre</label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Rick, Morty, Summer..."
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Estado</label>
            <select
              value={filters.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="">Todos</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Tipo</label>
            <input
              type="text"
              value={filters.type}
              onChange={(e) => handleChange("type", e.target.value)}
              placeholder="Parasite, Clone..."
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-2">Género</label>
            <select
              value={filters.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="">Todos</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="genderless">Genderless</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div className="md:col-span-4 flex items-center justify-between">
            <p className="text-slate-400 text-sm">
              {loading ? "Buscando..." : `${total} coincidencias (mostrando ${characters.length})`}
            </p>
            <button
              onClick={() => setFilters(initialFilters)}
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
            >
              <IoRefresh size={18} /> Limpiar filtros
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-6 text-center mb-8">
            <IoWarningOutline size={28} className="inline-block mr-2" />
            {error}
          </div>
        )}

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
                  loading="lazy"
                  priority={false}
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold truncate">{character.name}</h2>
                  <p className="text-slate-500 text-sm mb-2">
                    {character.species} · {character.gender}
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