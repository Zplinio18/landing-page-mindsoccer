import { useState } from "react";
import { FaPen, FaSearch, FaStar, FaTrash } from "react-icons/fa";
import type { Testimonial } from "../lib/testimonials";

export interface AdminTestimonial extends Testimonial {
  active: boolean;
}

interface TestimonialListProps {
  testimonials: AdminTestimonial[];
  loading: boolean;
  disabled: boolean;
  hasError: boolean;
  onEdit: (testimonial: AdminTestimonial) => void;
  onDelete: (testimonial: AdminTestimonial) => void;
}

export default function TestimonialList({
  testimonials,
  loading,
  disabled,
  hasError,
  onEdit,
  onDelete,
}: TestimonialListProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filtered = testimonials.filter(
    (item) =>
      (status === "all" || item.active === (status === "active")) &&
      normalize(`${item.author} ${item.athlete} ${item.content}`).includes(
        normalize(search.trim()),
      ),
  );

  return (
    <section aria-label="Lista de depoimentos" aria-busy={loading}>
      <div className="mb-5 flex flex-col gap-3 min-[761px]:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar depoimento</span>
          <FaSearch
            aria-hidden="true"
            className="absolute left-4 top-4 text-sm text-slate-500"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por autor, atleta ou texto…"
            className="w-full rounded-lg border border-[#304159] bg-[#111b2a] py-3 pl-11 pr-4 text-sm placeholder:text-slate-500"
          />
        </label>
        <select
          aria-label="Filtrar por status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-[#304159] bg-[#111b2a] px-4 py-3 text-sm"
        >
          <option value="all">Todos os status</option>
          <option value="active">Publicados</option>
          <option value="inactive">Ocultos</option>
        </select>
      </div>
      {loading ? (
        <div role="status" className="space-y-3">
          <span className="sr-only">Carregando depoimentos…</span>
          {[0, 1, 2].map((index) => (
            <div
              aria-hidden="true"
              key={index}
              className="h-36 animate-pulse rounded-xl border border-white/5 bg-[#111b2a] motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <ul className="divide-y divide-[#253348] overflow-hidden rounded-xl border border-[#253348] bg-[#111b2a]">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="grid gap-5 p-5 min-[761px]:grid-cols-[minmax(0,1fr)_100px_160px] min-[761px]:items-center min-[761px]:gap-6 min-[761px]:p-6"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="break-words text-base font-semibold text-white">
                    {item.author}
                  </h2>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500">
                    Ordem {item.order}
                  </span>
                </div>
                <p className="mb-3 mt-1 text-xs text-slate-400">
                  {item.isAdult
                    ? "Atleta adulto"
                    : `Responsável por ${item.athlete} · ${item.age} anos`}
                </p>
                <p className="line-clamp-2 break-words text-sm leading-relaxed text-slate-300">
                  {item.content}
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-[#d5b477]">
                  <FaStar aria-hidden="true" /> {item.rating}/5
                </p>
              </div>
              <span
                className={`w-fit rounded-full border px-2.5 py-1 text-[11px] ${item.active ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-slate-500/20 bg-slate-500/10 text-slate-400"}`}
              >
                {item.active ? "Publicado" : "Oculto"}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onEdit(item)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#304159] px-3 py-2.5 text-xs text-blue-200 hover:bg-white/5"
                  aria-label={`Editar depoimento de ${item.author}`}
                >
                  <FaPen aria-hidden="true" /> Editar
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onDelete(item)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-400/20 px-3 py-2.5 text-xs text-red-300 hover:bg-red-400/10"
                  aria-label={`Excluir depoimento de ${item.author}`}
                >
                  <FaTrash aria-hidden="true" /> Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !hasError && (
          <div className="rounded-xl border border-dashed border-[#304159] px-6 py-16 text-center">
            <h2 className="text-lg font-semibold">
              {testimonials.length
                ? "Nenhum resultado encontrado"
                : "Nenhum depoimento cadastrado"}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {testimonials.length
                ? "Tente outra busca ou altere o filtro de status."
                : "Clique em Novo depoimento para adicionar o primeiro."}
            </p>
          </div>
        )
      )}
    </section>
  );
}
