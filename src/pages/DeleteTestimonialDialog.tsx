import { useEffect, useRef } from "react";
import { FaTrash } from "react-icons/fa";
import type { AdminTestimonial } from "./TestimonialList";

interface DeleteTestimonialDialogProps {
  testimonial: AdminTestimonial;
  busy: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteTestimonialDialog({
  testimonial,
  busy,
  error,
  onCancel,
  onConfirm,
}: DeleteTestimonialDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    cancelButton.current?.focus();
    return () => element?.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="delete-testimonial-title"
      aria-describedby="delete-testimonial-description"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
      className="m-auto w-[calc(100%-32px)] max-w-md rounded-2xl border border-[#304159] bg-[#111b2a] p-6 font-exo2 text-white shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
    >
      <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-red-400/10 text-red-300">
        <FaTrash aria-hidden="true" />
      </span>
      <h2 id="delete-testimonial-title" className="text-xl font-semibold">
        Excluir depoimento?
      </h2>
      <p
        id="delete-testimonial-description"
        className="mt-3 text-sm leading-relaxed text-slate-300"
      >
        O depoimento de{" "}
        <strong className="text-white">{testimonial.author}</strong> será
        removido da planilha e deixará de aparecer no site. Essa ação não pode
        ser desfeita pelo painel.
      </p>
      <blockquote className="my-5 line-clamp-3 break-words rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-slate-400">
        {testimonial.content}
      </blockquote>
      {error && (
        <p
          role="alert"
          className="mb-5 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200"
        >
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 min-[400px]:flex-row">
        <button
          ref={cancelButton}
          type="button"
          disabled={busy}
          onClick={onCancel}
          className="flex-1 rounded-lg border border-[#304159] px-4 py-3 text-sm text-slate-200 hover:bg-white/5"
        >
          Cancelar
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onConfirm}
          className="flex-1 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600"
        >
          {busy ? "Excluindo…" : "Excluir depoimento"}
        </button>
      </div>
    </dialog>
  );
}
