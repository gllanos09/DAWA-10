import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { IoPlanet, IoSearch, IoList } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Personajes - Rick and Morty",
  description: "Lista de personajes del multiverso de Rick and Morty",
};

interface CharactersLayoutProps {
  children: ReactNode;
}

export default function CharactersLayout({ children }: CharactersLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-emerald-950">
      <nav className="bg-black/40 backdrop-blur-sm sticky top-0 z-50 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link
            href="/characters"
            className="text-white text-2xl font-bold hover:text-emerald-400 transition"
          >
            <IoPlanet size={30} className="inline-block" /> Rick and Morty
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/characters"
              className="text-slate-200 hover:text-emerald-400 transition inline-flex items-center gap-1"
            >
              <IoList size={20} /> Lista
            </Link>
            <Link
              href="/characters/search"
              className="text-slate-200 hover:text-emerald-400 transition inline-flex items-center gap-1"
            >
              <IoSearch size={20} /> Buscar
            </Link>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}