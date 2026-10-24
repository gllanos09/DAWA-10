import Link from "next/link";
import { IoSearchOutline, IoArrowBack } from "react-icons/io5";

export default function CharacterNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-8">
      <div className="max-w-xl w-full bg-white text-slate-700 rounded-2xl shadow-2xl overflow-hidden text-center">
        <div className="bg-linear-to-r from-slate-900 to-emerald-700 p-8">
          <h1 className="text-7xl font-bold text-white drop-shadow-lg">404</h1>
          <p className="text-white text-xl mt-2">
            <IoSearchOutline size={24} className="inline-block mr-2" />
            Personaje no encontrado
          </p>
        </div>

        <div className="p-8">
          <p className="mb-2">
            El personaje que buscas no existe en esta dimensión o la ruta es incorrecta.
          </p>
          <p className="text-slate-500 mb-8">
            Verifica el identificador e inténtalo nuevamente.
          </p>

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