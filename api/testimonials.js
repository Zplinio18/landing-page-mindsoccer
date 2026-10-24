import { createHash, timingSafeEqual } from "node:crypto";
import { validateTestimonial } from "../server/validation.js";

function equal(a, b) {
  return (
    typeof a === "string" &&
    typeof b === "string" &&
    timingSafeEqual(
      createHash("sha256").update(a).digest(),
      createHash("sha256").update(b).digest(),
    )
  );
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Método não permitido." });
  }
  const action = req.method === "GET" ? "list" : (req.body?.action ?? "create");
  let testimonial;
  let id;
  if (req.method === "POST") {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)
      return res
        .status(503)
        .json({ error: "O acesso administrativo ainda não foi configurado." });
    const origin = req.headers.origin;
    if (
      origin &&
      origin !== `https://${req.headers.host}` &&
      origin !== `http://${req.headers.host}`
    )
      return res.status(403).json({ error: "Origem não permitida." });
    if (
      !equal(
        typeof req.body?.email === "string"
          ? req.body.email.trim().toLowerCase()
          : undefined,
        process.env.ADMIN_EMAIL.trim().toLowerCase(),
      ) ||
      !equal(req.body?.password, process.env.ADMIN_PASSWORD)
    )
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    if (action === "authenticate")
      return res.status(200).json({ authenticated: true });
    if (!["create", "listAll", "update", "delete"].includes(action))
      return res.status(400).json({ error: "Ação inválida." });
    if (["update", "delete"].includes(action)) {
      id = req.body?.id;
      if (typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(id))
        return res
          .status(400)
          .json({ error: "Identificador do depoimento inválido." });
    }
    if (["create", "update"].includes(action)) {
      try {
        testimonial = validateTestimonial(req.body.testimonial);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
  }
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!url || !secret)
    return res
      .status(503)
      .json({
        error: "A integração com a planilha ainda não foi configurada.",
      });
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, action, id, testimonial }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error("Google indisponível");
    const data = await response.json();
    if (!data.ok) {
      if (data.code === "NOT_FOUND")
        return res
          .status(404)
          .json({
            error: "Esse depoimento não existe mais. Atualize a listagem.",
          });
      if (data.code === "CONFLICT")
        return res
          .status(409)
          .json({
            error:
              "Há IDs duplicados na planilha. Corrija os IDs antes de alterar este depoimento.",
          });
      throw new Error("Erro na planilha");
    }
    if (["list", "listAll"].includes(action)) {
      if (!Array.isArray(data.testimonials))
        throw new Error("Resposta inválida");
      return res.status(200).json({ testimonials: data.testimonials });
    }
    if (typeof data.id !== "string" || !data.id)
      throw new Error("Confirmação inválida");
    return res.status(action === "create" ? 201 : 200).json({ id: data.id });
  } catch {
    return res
      .status(502)
      .json({
        error:
          "Não foi possível confirmar a operação na planilha. Confira a configuração e a implantação do Apps Script. Antes de repetir uma alteração, atualize a listagem.",
      });
  }
}
