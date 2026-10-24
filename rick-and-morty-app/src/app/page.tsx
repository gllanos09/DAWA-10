import Link from "next/link";
import { IoPlanet, IoArrowForward } from "react-icons/io5";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center bg-linear-to-br from-slate-900 to-emerald-900 p-8">
      <div className="text-center max-w-2xl">
        <IoPlanet size={80} className="inline-block text-emerald-400 mb-6" />
        <h1 className="text-5xl font-bold text-white mb-4">Rick and Morty</h1>
        <p className="text-slate-300 text-lg mb-10">
          Explora los personajes del multiverso. Aplicación construida con Next.js
          usando renderizado estático (SSG), regeneración incremental (ISR) y
          búsqueda en el cliente (CSR).
        </p>
        <Link
          href="/characters"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-4 px-8 rounded-lg transition"
        >
          Ver personajes
          <IoArrowForward size={20} />
        </Link>
      </div>
    </main>
  );
}