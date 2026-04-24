"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getBreedsByPetType } from "@/lib/constants";

type Props = {
  value: string;
  onChange: (v: string) => void;
  petType?: string;
  placeholder?: string;
  className?: string;
};

export default function BreedCombobox({
  value,
  onChange,
  petType = "Dog",
  placeholder = "Select a breed...",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const breeds = getBreedsByPetType(petType);
    if (!search.trim()) return breeds;
    const q = search.toLowerCase();
    return breeds.filter((b) => b.toLowerCase().includes(q));
  }, [search, petType]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && searchInputRef.current) searchInputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (open && value && listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]');
      if (selected) selected.scrollIntoView({ block: "nearest" });
    }
  }, [open, value]);

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setSearch("");
        }}
        className={`w-full px-3 py-2 border rounded-lg text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gold ${
          open ? "border-gold ring-2 ring-gold" : "border-gray-300"
        } ${value ? "text-gray-900" : "text-gray-400"}`}
      >
        <span className="flex-1 truncate">{value || placeholder}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg bg-white border border-gray-200 shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search breeds..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
          </div>
          <ul ref={listRef} className="max-h-56 overflow-y-auto overscroll-contain">
            {filtered.length > 0 ? (
              filtered.map((breed) => (
                <li key={breed}>
                  <button
                    type="button"
                    data-selected={value === breed}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                      value === breed
                        ? "bg-gold/10 text-deep-green font-medium"
                        : "text-gray-800 hover:bg-gold/5"
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onChange(breed);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    {breed}
                    {value === breed && (
                      <svg
                        className="w-4 h-4 text-deep-green"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">No breeds found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
