// Local API fixture only. This file is never imported by application code.
import http from "node:http";
import { randomUUID } from "node:crypto";
const adminId = "11111111-1111-4111-8111-111111111111";
const memberId = "22222222-2222-4222-8222-222222222222";
let messages = [],
  failInsert = false,
  adminEnabled = true;
const encode = (object) =>
  Buffer.from(JSON.stringify(object)).toString("base64url");
const token = (id) =>
  `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: id, aud: "authenticated", role: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600 })}.local-test-signature`;
const tokens = new Map([
  [token(adminId), adminId],
  [token(memberId), memberId],
]);
const user = (id) => ({
  id,
  aud: "authenticated",
  role: "authenticated",
  email: id === adminId ? "admin@example.com" : "member@example.com",
  email_confirmed_at: new Date().toISOString(),
  app_metadata: { provider: "email" },
  user_metadata: { role: "admin" },
  created_at: new Date().toISOString(),
});
function reset() {
  failInsert = false;
  adminEnabled = true;
  messages = [
    {
      id: "33333333-3333-4333-8333-333333333333",
      name: "Earlier Contact",
      organization: "Research Lab",
      email: "earlier@example.com",
      subject: "Collaboration",
      message: "An earlier collaboration inquiry.",
      created_at: "2025-01-01T10:00:00.000Z",
      status: "read",
    },
  ];
}
reset();
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:54329");
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  let body = {};
  try {
    body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
  } catch {
    /* invalid test body */
  }
  const send = (status, data, headers = {}) => {
    res.writeHead(status, { "Content-Type": "application/json", ...headers });
    res.end(
      req.method === "HEAD" || status === 204
        ? undefined
        : JSON.stringify(data),
    );
  };
  if (url.pathname === "/health") return send(200, { ok: true });
  if (url.pathname === "/__test/reset") {
    reset();
    return send(200, {});
  }
  if (url.pathname === "/__test/control") {
    if ("failInsert" in body) failInsert = body.failInsert;
    if ("adminEnabled" in body) adminEnabled = body.adminEnabled;
    return send(200, {});
  }
  if (url.pathname === "/__test/messages") return send(200, messages);
  if (url.pathname === "/__test/seed") {
    for (let i = 0; i < body.count; i++)
      messages.push({
        ...messages[0],
        id: randomUUID(),
        name: `Seed ${i}`,
        email: `seed${i}@example.com`,
        status: "new",
        created_at: new Date().toISOString(),
      });
    return send(200, {});
  }
  const bearer = req.headers.authorization?.replace("Bearer ", "");
  const id = tokens.get(bearer);
  if (url.pathname === "/auth/v1/token") {
    if (
      !["admin@example.com", "member@example.com"].includes(body.email) ||
      body.password !== "local-test-password"
    )
      return send(400, {
        error: "invalid_grant",
        error_description: "Invalid credentials",
      });
    const uid = body.email === "admin@example.com" ? adminId : memberId;
    return send(200, {
      access_token: [...tokens].find(([, value]) => value === uid)[0],
      refresh_token: `refresh-${uid}`,
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: "bearer",
      user: user(uid),
    });
  }
  if (url.pathname === "/auth/v1/user")
    return id ? send(200, user(id)) : send(401, { message: "Invalid token" });
  if (url.pathname === "/auth/v1/logout") return send(204, {});
  if (url.pathname === "/rest/v1/admin_users")
    return send(
      200,
      id === adminId && adminEnabled ? [{ user_id: adminId }] : [],
    );
  if (url.pathname !== "/rest/v1/contact_submissions") return send(404, {});
  if (req.method === "POST") {
    if (failInsert)
      return send(503, { message: "Simulated unavailable database" });
    messages.push({
      ...body,
      id: randomUUID(),
      created_at: new Date().toISOString(),
      status: "new",
    });
    return send(201, null);
  }
  if (id !== adminId || !adminEnabled)
    return send(403, { message: "RLS denied" });
  let rows = [...messages];
  for (const key of ["id", "subject", "status"]) {
    const filter = url.searchParams.get(key);
    if (filter?.startsWith("eq."))
      rows = rows.filter((row) => row[key] === filter.slice(3));
  }
  for (const filter of url.searchParams.getAll("created_at")) {
    if (filter.startsWith("gte."))
      rows = rows.filter((row) => row.created_at >= filter.slice(4));
    if (filter.startsWith("lt."))
      rows = rows.filter((row) => row.created_at < filter.slice(3));
  }
  const expression = url.searchParams.get("or");
  if (expression) {
    const value =
      expression
        .match(/name\.ilike\."%((?:\\.|[^"\\])*)%"/)?.[1]
        ?.replace(/\\(.)/g, "$1") || "";
    rows = rows.filter((row) =>
      ["name", "organization", "email", "subject", "message"].some((key) =>
        row[key].toLowerCase().includes(value.toLowerCase()),
      ),
    );
  }
  if (req.method === "PATCH") {
    rows.forEach((row) => {
      row.status = body.status;
    });
  }
  if (req.method === "DELETE") {
    messages = messages.filter(
      (row) => !rows.some((found) => found.id === row.id),
    );
  }
  const count = rows.length;
  const asc = url.searchParams.get("order")?.startsWith("created_at.asc");
  rows.sort(
    (a, b) =>
      (a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id)) *
      (asc ? 1 : -1),
  );
  const offset = Number(url.searchParams.get("offset") || 0);
  const limit = Number(url.searchParams.get("limit") || count);
  rows = rows.slice(offset, offset + limit);
  const object = req.headers.accept?.includes("vnd.pgrst.object");
  send(200, object ? rows[0] || null : rows, {
    "Content-Range": `${offset}-${Math.max(offset, offset + rows.length - 1)}/${count}`,
  });
});
server.listen(54329, "127.0.0.1", () =>
  console.log("Local Supabase fixture ready on 54329"),
);
