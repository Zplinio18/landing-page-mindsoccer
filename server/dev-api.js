import handler from "../api/testimonials.js";

export default function devApi(env) {
  return {
    name: "mindsoccer-dev-api",
    configureServer(server) {
      for (const key of [
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
        "GOOGLE_APPS_SCRIPT_URL",
        "GOOGLE_APPS_SCRIPT_SECRET",
      ]) {
        if (env[key] !== undefined) process.env[key] = env[key];
      }
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split("?")[0] !== "/api/testimonials") return next();
        res.status = function (code) {
          this.statusCode = code;
          return this;
        };
        res.json = function (data) {
          this.setHeader("Content-Type", "application/json; charset=utf-8");
          this.end(JSON.stringify(data));
          return this;
        };
        try {
          if (req.method === "POST") {
            let size = 0;
            const chunks = [];
            for await (const chunk of req) {
              size += chunk.length;
              if (size > 32768) {
                res.status(413).json({ error: "Requisição muito grande." });
                return;
              }
              chunks.push(chunk);
            }
            try {
              req.body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
            } catch {
              res.status(400).json({ error: "Envie um JSON válido." });
              return;
            }
          }
          await handler(req, res);
        } catch {
          if (!res.headersSent)
            res
              .status(500)
              .json({ error: "Não foi possível processar a solicitação." });
          else res.end();
        }
      });
    },
  };
}
