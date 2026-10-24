import Link from 'next/link';
import { IoSearchOutline, IoArrowBack } from 'react-icons/io5';

export default function PokemonNotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-8">
      <div className="max-w-xl w-full bg-white text-gray-700 rounded-2xl shadow-2xl overflow-hidden text-center">
        <div className="bg-linear-to-r from-black to-purple-700 p-8">
          <h1 className="text-7xl font-bold text-white drop-shadow-lg">404</h1>
          <p className="text-white text-xl mt-2">
            <IoSearchOutline size={24} className="inline-block mr-2" />
            Pokémon no encontrado
          </p>
        </div>

        <div className="p-8">
          <p className="mb-2">
            El Pokémon que buscas no existe en la Pokédex o la ruta es incorrecta.
          </p>
          <p className="text-gray-500 mb-8">
            Verifica el nombre e inténtalo nuevamente. Recuerda que solo están
            disponibles los primeros 151 Pokémon.
          </p>

          <Link
            href="/pokemon"
            className="inline-flex items-center gap-2 bg-black hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            <IoArrowBack size={20} />
            Volver al Pokédex
          </Link>
        </div>
      </div>
    </div>
  );
}