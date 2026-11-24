"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

interface TeamsCatalogFilterProps {
  categories: string[];
  selectedCategory: string;
  currentSearch: string;
}

export default function TeamsCatalogFilter({
  categories,
  selectedCategory,
  currentSearch,
}: TeamsCatalogFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(currentSearch);

  const updateFilters = (newCategory: string, newSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory && newCategory !== "Barcha toifalar") {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }

    if (newSearch && newSearch.trim() !== "") {
      params.set("q", newSearch.trim());
    } else {
      params.delete("q");
    }

    router.push(`/teams?${params.toString()}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters(e.target.value, q);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(selectedCategory, q);
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center gap-4"
    >
      {/* 1. Kategoriyalar Drop-down */}
      <div className="w-full md:w-72 relative">
        <label htmlFor="category-select" className="sr-only">Kategoriyalar</label>
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-tiu-800 focus:bg-white cursor-pointer transition-all"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Qidiruv Input */}
      <div className="relative flex-grow w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Jamoa nomi, loyiha yoki texnologiya bo'yicha qidiruv..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tiu-800 focus:bg-white transition-all"
        />
      </div>

      {/* Qidirish tugmasi */}
      <button
        type="submit"
        className="w-full md:w-auto px-6 py-2.5 bg-tiu-900 hover:bg-tiu-950 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Izlash</span>
      </button>
    </form>
  );
}