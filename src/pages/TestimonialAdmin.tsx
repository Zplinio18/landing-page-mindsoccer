import { useState } from "react";
import type { FormEvent } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaPlus,
  FaQuoteLeft,
  FaSignOutAlt,
  FaStar,
  FaSyncAlt,
} from "react-icons/fa";
import TestimonialList from "./TestimonialList";
import type { AdminTestimonial } from "./TestimonialList";
import DeleteTestimonialDialog from "./DeleteTestimonialDialog";
import logo from "../assets/images/logo.png";

const fieldClass =
  "mb-5 flex flex-col gap-2 text-xs font-semibold text-[#c6d2e3]";
const inputClass =
  "block w-full min-w-0 rounded-lg border border-[#304159] bg-[#0c1523] px-3.5 py-3 text-sm font-normal text-[#e6edf7] transition-[border-color,box-shadow] duration-150 placeholder:text-[#7f90a9] focus:border-[#4b85cd] focus:outline-none focus:shadow-[0_0_0_3px_#3175cc30] motion-reduce:transition-none";
const primaryClass =
  "flex w-full items-center justify-center gap-3 rounded-lg border border-secondary bg-secondary px-5 py-3.5 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-[#003477] motion-reduce:transition-none [&_svg]:text-[11px]";
const messageClass =
  "mb-[18px] flex items-center gap-2.5 rounded-lg border px-3.5 py-3 text-xs";
const errorClass = "border-[#69313c] bg-[#351b24] text-[#ffb0ab]";
const successClass = "border-[#285641] bg-[#102e25] text-[#90dfb6]";
const headerLinkClass =
  "ml-auto flex items-center gap-[9px] border-0 bg-transparent text-xs text-[#cbd7e8] no-underline hover:text-white";

const empty = {
  author: "",
  athlete: "",
  age: "",
  content: "",
  rating: 5,
  order: 1,
  active: true,
  isAdult: false,
};

async function request(body: object) {
  const response = await fetch("/api/testimonials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error(
      "A API local não está disponível. Reinicie o servidor com npm run dev.",
    );
  }
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Não foi possível concluir a solicitação.");
  return data;
}

export default function TestimonialAdmin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [authenticated, setAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [draft, setDraft] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AdminTestimonial | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState("");

  async function loadList() {
    setLoadingList(true);
    try {
      const data = await request({ ...credentials, action: "listAll" });
      if (!Array.isArray(data.testimonials))
        throw new Error("Resposta inválida ao carregar os depoimentos.");
      setTestimonials(data.testimonials);
    } finally {
      setLoadingList(false);
    }
  }

  async function refreshList() {
    if (busy || loadingList) return;
    setMessage("");
    setSuccess(false);
    try {
      await loadList();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os depoimentos.",
      );
    }
  }

  function openForm(item?: AdminTestimonial) {
    setEditingId(item?.id ?? null);
    setDraft(
      item
        ? {
            author: item.author,
            athlete: item.athlete,
            age: String(item.age),
            content: item.content,
            rating: item.rating,
            order: item.order,
            active: item.active,
            isAdult: item.isAdult,
          }
        : {
            ...empty,
            order: Math.min(
              100000,
              Math.max(0, ...testimonials.map((entry) => entry.order)) + 1,
            ),
          },
    );
    setView("form");
    setMessage("");
    setSuccess(false);
    window.scrollTo({ top: 0 });
  }

  async function deleteTestimonial() {
    if (!pendingDelete || busy) return;
    setBusy(true);
    setDeleteError("");
    try {
      await request({ ...credentials, action: "delete", id: pendingDelete.id });
      setTestimonials((previous) =>
        previous.filter((item) => item.id !== pendingDelete.id),
      );
      setPendingDelete(null);
      setSuccess(true);
      setMessage("Depoimento excluído com sucesso.");
    } catch (error) {
      setDeleteError(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "Não foi possível confirmar a exclusão. Atualize a listagem antes de tentar novamente.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      await request({ ...credentials, action: "authenticate" });
      setAuthenticated(true);
      setView("list");
      await loadList();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível entrar. Tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    setSuccess(false);
    try {
      const data = await request({
        ...credentials,
        action: editingId ? "update" : "create",
        id: editingId ?? undefined,
        testimonial: {
          ...draft,
          athlete: draft.isAdult ? "" : draft.athlete,
          age: draft.isAdult ? "" : Number(draft.age),
        },
      });
      if (typeof data.id !== "string")
        throw new Error(
          "Não foi possível confirmar a alteração. Atualize a listagem antes de tentar novamente.",
        );
      const saved: AdminTestimonial = {
        ...draft,
        id: data.id,
        author: draft.author.trim(),
        content: draft.content.trim(),
        athlete: draft.isAdult ? "" : draft.athlete.trim(),
        age: draft.isAdult ? "" : Number(draft.age),
      };
      setTestimonials((previous) =>
        [...previous.filter((item) => item.id !== saved.id), saved].sort(
          (a, b) => a.order - b.order,
        ),
      );
      setSuccess(true);
      setMessage(
        editingId
          ? "Depoimento atualizado com sucesso."
          : "Depoimento cadastrado com sucesso.",
      );
      setView("list");
      setEditingId(null);
      setDraft(empty);
      window.scrollTo({ top: 0 });
    } catch (error) {
      setMessage(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "Não foi possível confirmar a alteração. Atualize a listagem antes de tentar novamente.",
      );
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    setAuthenticated(false);
    setCredentials({ email: "", password: "" });
    setMessage("");
    setSuccess(false);
    setShowPassword(false);
    setTestimonials([]);
    setView("list");
    setEditingId(null);
    setDraft(empty);
    setPendingDelete(null);
    setDeleteError("");
  }

  return (
    <main className="min-h-screen bg-[#080e18] font-exo2 text-[15px] leading-normal text-[#e6edf7] [color-scheme:dark] [&_:focus-visible]:outline [&_:focus-visible]:outline-[3px] [&_:focus-visible]:outline-offset-[3px] [&_:focus-visible]:outline-[#5c98ef] [&_button:disabled]:cursor-wait [&_button:disabled]:opacity-[0.65] [&_button]:cursor-pointer">
      <header className="flex h-[72px] items-center gap-3 border-b border-[#233650] bg-[#071a34] px-5 text-white min-[761px]:h-[88px] min-[761px]:gap-6 min-[761px]:px-[max(24px,calc((100%-1180px)/2))]">
        <a href="/" aria-label="MindSoccer — página inicial">
          <img
            className="h-[54px] w-[135px] object-contain min-[761px]:h-[65px] min-[761px]:w-[174px]"
            src={logo}
            alt="MindSoccer"
          />
        </a>
        <span className="hidden border-l border-[#35465c] pl-6 text-[10px] tracking-[2px] text-[#99adc7] min-[761px]:inline">
          ÁREA DO ADMINISTRADOR
        </span>
        {authenticated ? (
          <button
            className={headerLinkClass}
            onClick={logout}
            disabled={busy || loadingList}
          >
            <FaSignOutAlt /> Sair
          </button>
        ) : (
          <a className={headerLinkClass} href="/">
            <FaArrowLeft /> Voltar ao site
          </a>
        )}
      </header>
      {!authenticated ? (
        <div className="mx-auto mb-12 mt-[38px] grid max-w-[490px] grid-cols-1 items-center gap-8 px-6 min-[761px]:my-20 min-[761px]:max-w-[1080px] min-[761px]:grid-cols-[1.1fr_1fr] min-[761px]:gap-[90px]">
          <section>
            <span className="block text-[10px] font-bold tracking-[2px] text-[#7aaefa]">
              CADA EVOLUÇÃO TEM UMA HISTÓRIA
            </span>
            <h1 className="my-3.5 text-4xl font-bold leading-[1.12] tracking-[-1.2px] min-[761px]:my-6 min-[761px]:text-[clamp(36px,4vw,52px)] min-[761px]:tracking-[-2px]">
              Quem vive o treino
              <br />
              tem muito a <em className="not-italic text-[#72aaff]">contar.</em>
            </h1>
            <p className="max-w-[360px] text-[13px] leading-[1.9] text-[#a4b2c6] min-[761px]:text-[15px]">
              Reúna as experiências dos pais e atletas e mostre o impacto da
              metodologia MindSoccer.
            </p>
            <div className="my-[42px] hidden items-center gap-5 text-[#79aafa] min-[761px]:flex">
              <FaQuoteLeft className="text-[29px]" />
              <span className="text-[13px] text-[#9facbf]">
                Histórias reais.
                <br />
                <strong className="font-medium text-[#d2deef]">
                  Confiança que se constrói.
                </strong>
              </span>
            </div>
            <span className="hidden text-[9px] tracking-[2px] text-[#8b97a7] min-[761px]:block">
              MENTALIDADE · EVOLUÇÃO · PERFORMANCE
            </span>
          </section>
          <section
            className="rounded-[18px] border border-[#253348] bg-[#111b2a] p-7 shadow-[0_16px_50px_#00000030] min-[761px]:p-10"
            aria-labelledby="login-title"
          >
            <span className="mb-6 grid h-[46px] w-[46px] place-items-center rounded-[13px] bg-[#192e49] text-[#8dbbff]">
              <FaLock />
            </span>
            <h2
              className="mb-2 text-[25px] font-bold tracking-[-0.7px]"
              id="login-title"
            >
              Bem-vindo de volta
            </h2>
            <p className="mb-[30px] text-[13px] text-[#a6b3c7]">
              Entre para gerenciar os depoimentos.
            </p>
            <form onSubmit={login}>
              <fieldset disabled={busy} className="m-0 min-w-0 border-0 p-0">
                <label className={fieldClass}>
                  E-mail do administrador
                  <input
                    className={inputClass}
                    type="email"
                    name="email"
                    autoComplete="username"
                    placeholder="seu@email.com"
                    required
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
                    }
                  />
                </label>
                <label className={fieldClass}>
                  Senha
                  <div className="relative [&_input]:pr-12">
                    <input
                      className={inputClass}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      placeholder="Sua senha de acesso"
                      required
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.target.value,
                        })
                      }
                    />
                    <button
                      className="absolute right-1 top-1 grid h-[38px] w-[38px] place-items-center border-0 bg-transparent text-[#acbad0]"
                      type="button"
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </label>
                {message && (
                  <p className={`${messageClass} ${errorClass}`} role="alert">
                    {message}
                  </p>
                )}
                <button className={primaryClass} type="submit">
                  {busy ? (
                    "Verificando acesso…"
                  ) : (
                    <>
                      Entrar no painel <FaArrowRight />
                    </>
                  )}
                </button>
              </fieldset>
            </form>
            <p className="mt-6 text-center text-[11px] text-[#94a0b0]">
              Use o acesso administrativo configurado para o site.
            </p>
          </section>
        </div>
      ) : (
        <div className="mx-auto mb-16 mt-7 max-w-[1140px] px-[18px] min-[761px]:mt-11 min-[761px]:px-6">
          <div className="mb-8 flex items-start justify-between gap-3 min-[761px]:items-center">
            <div>
              <span className="block text-[10px] font-bold tracking-[2px] text-[#7aaefa]">
                PAINEL MINDSOCCER
              </span>
              <h1 className="my-2 text-[27px] font-bold tracking-[-1px] min-[761px]:text-[32px]">
                {view === "list"
                  ? "Depoimentos"
                  : editingId
                    ? "Editar depoimento"
                    : "Novo depoimento"}
              </h1>
              <p className="text-xs text-[#a4b2c6] min-[761px]:text-[13px]">
                {view === "list"
                  ? "Gerencie as histórias de pais e atletas que aparecem no site."
                  : "Dê espaço para quem faz parte dessa evolução."}
              </p>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 whitespace-nowrap rounded-lg border border-[#304159] bg-[#111b2a] px-2.5 py-2 text-[11px] text-[#99beef] no-underline min-[761px]:px-4 min-[761px]:py-2.5 min-[761px]:text-xs [&_svg]:text-[10px]"
            >
              Ver site <FaArrowRight />
            </a>
          </div>
          {view === "list" ? (
            <>
              <div className="mb-6 flex flex-col gap-4 min-[761px]:flex-row min-[761px]:items-center min-[761px]:justify-between">
                <p className="text-xs text-slate-400">
                  {testimonials.length}{" "}
                  {testimonials.length === 1 ? "depoimento" : "depoimentos"} ·{" "}
                  {testimonials.filter((item) => item.active).length} publicados
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={busy || loadingList}
                    onClick={refreshList}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#304159] px-4 py-3 text-xs text-slate-300"
                  >
                    <FaSyncAlt
                      aria-hidden="true"
                      className={
                        loadingList
                          ? "animate-spin motion-reduce:animate-none"
                          : ""
                      }
                    />{" "}
                    Atualizar
                  </button>
                  <button
                    type="button"
                    disabled={busy || loadingList}
                    onClick={() => openForm()}
                    className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-3 text-xs font-semibold text-white"
                  >
                    <FaPlus aria-hidden="true" /> Novo depoimento
                  </button>
                </div>
              </div>
              {message && (
                <p
                  role={success ? "status" : "alert"}
                  className={`${messageClass} ${success ? successClass : errorClass}`}
                >
                  {message}
                </p>
              )}
              <TestimonialList
                testimonials={testimonials}
                loading={loadingList}
                disabled={busy || loadingList}
                hasError={Boolean(message && !success)}
                onEdit={openForm}
                onDelete={(item) => {
                  setPendingDelete(item);
                  setDeleteError("");
                }}
              />
            </>
          ) : (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setView("list");
                  setMessage("");
                  setSuccess(false);
                }}
                className="mb-6 inline-flex items-center gap-2 text-sm text-blue-200"
              >
                <FaArrowLeft aria-hidden="true" /> Voltar à listagem
              </button>
              <div className="grid grid-cols-1 items-start gap-7 min-[761px]:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] min-[761px]:gap-[30px]">
                <form
                  className="overflow-hidden rounded-[14px] border border-[#253348] bg-[#111b2a]"
                  onSubmit={submit}
                >
                  <fieldset
                    disabled={busy}
                    className="m-0 min-w-0 border-0 p-0"
                  >
                    <section className="border-b border-[#253348] px-5 pb-2 pt-[22px] min-[761px]:px-[30px] min-[761px]:pb-3 min-[761px]:pt-7">
                      <div className="mb-[22px] flex items-center gap-3 [&>h2]:text-[15px] [&>h2]:font-semibold [&>span]:rounded-[7px] [&>span]:border [&>span]:border-[#2a466b] [&>span]:bg-[#182c46] [&>span]:px-[7px] [&>span]:py-[5px] [&>span]:text-[10px] [&>span]:text-[#93beff]">
                        <span>01</span>
                        <h2>Quem está contando?</h2>
                      </div>
                      <label className="mb-6 flex cursor-pointer items-center gap-3 rounded-lg border border-[#2a3b53] bg-[#111e30] px-4 py-3.5">
                        <input
                          className="h-[18px] w-[18px] shrink-0 accent-secondary"
                          type="checkbox"
                          checked={draft.isAdult}
                          onChange={(e) =>
                            setDraft({ ...draft, isAdult: e.target.checked })
                          }
                        />
                        <span className="flex flex-col gap-[3px]">
                          <strong className="text-xs font-semibold">
                            É adulto?
                          </strong>
                          <small className="text-[11px] text-[#a2b1c7]">
                            O depoimento é do próprio atleta.
                          </small>
                        </span>
                      </label>
                      <label className={fieldClass}>
                        Autor{" "}
                        {draft.isAdult
                          ? "(nome do atleta)"
                          : "(nome do responsável)"}
                        <input
                          className={inputClass}
                          name="author"
                          placeholder={
                            draft.isAdult
                              ? "Nome do atleta"
                              : "Nome do pai, mãe ou responsável"
                          }
                          required
                          maxLength={100}
                          value={draft.author}
                          onChange={(e) =>
                            setDraft({ ...draft, author: e.target.value })
                          }
                        />
                      </label>
                      {!draft.isAdult && (
                        <div className="grid grid-cols-[1.5fr_1fr] gap-3 min-[761px]:grid-cols-[1.6fr_1fr] min-[761px]:gap-[18px]">
                          <label className={fieldClass}>
                            Nome do atleta
                            <input
                              className={inputClass}
                              name="athlete"
                              placeholder="Nome do atleta"
                              required
                              maxLength={100}
                              value={draft.athlete}
                              onChange={(e) =>
                                setDraft({ ...draft, athlete: e.target.value })
                              }
                            />
                          </label>
                          <label className={fieldClass}>
                            Idade do atleta
                            <input
                              className={inputClass}
                              name="age"
                              type="number"
                              placeholder="Em anos"
                              min={1}
                              max={17}
                              required
                              value={draft.age}
                              onChange={(e) =>
                                setDraft({ ...draft, age: e.target.value })
                              }
                            />
                          </label>
                        </div>
                      )}
                    </section>
                    <section className="border-b border-[#253348] px-5 pb-2 pt-[22px] min-[761px]:px-[30px] min-[761px]:pb-3 min-[761px]:pt-7">
                      <div className="mb-[22px] flex items-center gap-3 [&>h2]:text-[15px] [&>h2]:font-semibold [&>span]:rounded-[7px] [&>span]:border [&>span]:border-[#2a466b] [&>span]:bg-[#182c46] [&>span]:px-[7px] [&>span]:py-[5px] [&>span]:text-[10px] [&>span]:text-[#93beff]">
                        <span>02</span>
                        <h2>A experiência</h2>
                      </div>
                      <label className={fieldClass}>
                        Depoimento
                        <textarea
                          className={`${inputClass} min-h-[140px] resize-y`}
                          name="content"
                          placeholder="Conte como foi a experiência com a MindSoccer…"
                          required
                          rows={5}
                          maxLength={3000}
                          value={draft.content}
                          onChange={(e) =>
                            setDraft({ ...draft, content: e.target.value })
                          }
                        />
                      </label>
                      <span className="-mt-3.5 mb-5 block text-right text-[10px] text-[#9ba7b7]">
                        {draft.content.length} / 3000
                      </span>
                      <div className="grid grid-cols-[1.5fr_1fr] gap-3 min-[761px]:grid-cols-[1.6fr_1fr] min-[761px]:gap-[18px]">
                        <label className={fieldClass}>
                          Avaliação
                          <select
                            className={inputClass}
                            name="rating"
                            value={draft.rating}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                rating: Number(e.target.value),
                              })
                            }
                          >
                            {[5, 4, 3, 2, 1].map((n) => (
                              <option key={n} value={n}>
                                {n} {n === 1 ? "estrela" : "estrelas"}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className={fieldClass}>
                          Ordem de exibição
                          <input
                            className={inputClass}
                            name="order"
                            type="number"
                            min={1}
                            max={100000}
                            required
                            value={draft.order}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                order: Number(e.target.value),
                              })
                            }
                          />
                        </label>
                      </div>
                    </section>
                    <div className="px-5 py-[22px] min-[761px]:px-[30px] min-[761px]:pb-7 min-[761px]:pt-6">
                      <label className="mb-6 flex cursor-pointer items-center gap-3">
                        <input
                          className="h-[18px] w-[18px] shrink-0 accent-secondary"
                          type="checkbox"
                          checked={draft.active}
                          onChange={(e) =>
                            setDraft({ ...draft, active: e.target.checked })
                          }
                        />
                        <span className="flex flex-col gap-[3px]">
                          <strong className="text-xs font-semibold">
                            Publicar no site
                          </strong>
                          <small className="text-[11px] text-[#a2b1c7]">
                            Desmarque para salvar sem exibir.
                          </small>
                        </span>
                      </label>
                      {message && (
                        <p
                          role={success ? "status" : "alert"}
                          className={`${messageClass} ${success ? successClass : errorClass}`}
                        >
                          {success && <FaCheck />}
                          {message}
                        </p>
                      )}
                      <button className={primaryClass} type="submit">
                        {busy ? (
                          "Salvando depoimento…"
                        ) : (
                          <>
                            <FaPlus />{" "}
                            {editingId
                              ? "Salvar alterações"
                              : draft.active
                                ? "Publicar depoimento"
                                : "Salvar depoimento"}
                          </>
                        )}
                      </button>
                    </div>
                  </fieldset>
                </form>
                <aside className="pt-2 min-[761px]:sticky min-[761px]:top-6">
                  <span className="mb-[18px] flex items-center gap-[9px] text-[9px] tracking-[1.5px] text-[#a4b2c6] [&_svg]:text-[13px]">
                    <FaEye /> PRÉVIA DO DEPOIMENTO
                  </span>
                  <div className="rounded-[14px] border-t-[3px] border-[#2262b0] bg-[linear-gradient(145deg,#102846,#071525)] px-[26px] py-[30px] text-white shadow-[0_10px_26px_#102d4c12] [overflow-wrap:anywhere]">
                    <FaQuoteLeft className="mb-[26px] text-[26px] text-[#5987be]" />
                    <div
                      className="flex gap-1 text-[13px] text-[#efbc56]"
                      aria-label={`${draft.rating} estrelas`}
                    >
                      {Array.from({ length: draft.rating }, (_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <p
                      className={`mb-[30px] mt-[22px] whitespace-pre-wrap text-[15px] leading-[1.9] ${draft.content ? "" : "italic text-[#9bacbf]"}`}
                    >
                      {draft.content ||
                        "As palavras de quem confia no seu trabalho vão aparecer aqui."}
                    </p>
                    <div className="flex items-center gap-3 border-t border-[#ffffff12] pt-5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#3c5c83] bg-[#183b64] text-[13px] text-[#aec9ec]">
                        {draft.author.trim().charAt(0).toUpperCase() || "M"}
                      </span>
                      <div className="flex flex-col gap-1">
                        <strong className="text-[13px] font-semibold">
                          {draft.author || "Nome do autor"}
                        </strong>
                        <span className="text-[10px] leading-[1.7] text-[#99acc5]">
                          {draft.isAdult
                            ? "Atleta"
                            : `Responsável pelo atleta: ${draft.athlete || "Nome do atleta"}${draft.age ? ` (${draft.age} anos)` : ""}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mx-[3px] mb-[30px] mt-4 text-[11px] leading-[1.8] text-[#a4b2c6]">
                    Confira o texto e os dados antes de publicar. A prévia
                    acompanha suas alterações.
                  </p>
                  <div className="hidden border-t border-[#253348] pt-[22px] min-[761px]:block">
                    <span className="text-[9px] font-semibold tracking-[1.4px] text-[#9ab8dd]">
                      FEITO PARA INSPIRAR
                    </span>
                    <p className="mt-2 text-xs leading-[1.8] text-[#a4b2c6]">
                      Um bom depoimento conta uma experiência. Preserve o jeito
                      de falar de cada autor.
                    </p>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      )}
      {pendingDelete && (
        <DeleteTestimonialDialog
          testimonial={pendingDelete}
          busy={busy}
          error={deleteError}
          onCancel={() => {
            if (!busy) {
              setPendingDelete(null);
              setDeleteError("");
            }
          }}
          onConfirm={deleteTestimonial}
        />
      )}
      <footer className="mx-[18px] flex max-w-[1092px] justify-between border-t border-[#253348] py-5 text-[9px] tracking-[1.5px] text-[#7b8da4] min-[761px]:mx-auto min-[761px]:p-6">
        MINDSOCCER{" "}
        <span className="max-w-[155px] text-right text-[10px] tracking-normal text-[#9aa6b5] min-[761px]:max-w-none">
          Buscando sempre a excelência.
        </span>
      </footer>
    </main>
  );
}
