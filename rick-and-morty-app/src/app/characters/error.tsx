"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IoWarningOutline, IoRefreshOutline, IoHomeOutline } from "react-icons/io5";

interface CharactersErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CharactersError({ error, reset }: CharactersErrorProps) {
  useEffect(() => {
    console.error("Error en la sección de personajes:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-8">
      <div className="max-w-xl w-full bg-white text-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-linear-to-r from-slate-900 to-red-600 p-8">
          <h1 className="text-4xl font-bold text-white text-center">
            <IoWarningOutline size={40} className="inline-block mr-2" />
            ¡Algo salió mal!
          </h1>
          <p className="text-white text-center mt-2">
            No se pudieron cargar los datos del API de Rick and Morty
          </p>
        </div>

        <div className="p-8">
          <p className="text-center mb-2">
            Ocurrió un error al procesar tu solicitud. Puedes intentarlo nuevamente.
          </p>

          <p className="text-sm text-slate-500 text-center bg-slate-100 rounded-lg p-3 mb-6 break-words">
            <strong>Detalle:</strong> {error.message}
            {error.digest && (
              <>
                <br />
                <strong>Código:</strong> {error.digest}
              </>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition cursor-pointer"
            >
              <IoRefreshOutline size={20} />
              Reintentar
            </button>

            <Link
              href="/characters"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              <IoHomeOutline size={20} />
              Volver a la lista
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}