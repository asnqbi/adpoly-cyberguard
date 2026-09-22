import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

// Real PostgreSQL policies, executed locally in WASM. No hosted data is touched.
const db = new PGlite();
let checks = 0;
const admin = "11111111-1111-4111-8111-111111111111";
const member = "22222222-2222-4222-8222-222222222222";
async function role(name, id = "") {
  await db.exec(`reset role; set role ${name};`);
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id]);
}
async function denied(sql, params = [], code = "42501") {
  await assert.rejects(db.query(sql, params), (error) => error.code === code);
  checks++;
}
function check(actual, expected) {
  assert.deepEqual(actual, expected);
  checks++;
}

try {
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    create schema auth;
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema public, auth to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated, service_role;
  `);
  await db.exec(
    await readFile(
      new URL(
        "../supabase/migrations/202609230001_contact_submissions.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  await db.query("insert into auth.users (id) values ($1), ($2)", [
    admin,
    member,
  ]);
  await db.query("insert into public.admin_users (user_id) values ($1)", [
    admin,
  ]);
  check(
    (
      await db.query(
        "select count(*)::int as count from pg_class where relname in ('contact_submissions','admin_users') and relrowsecurity",
      )
    ).rows[0].count,
    2,
  );

  const insert =
    "insert into public.contact_submissions (name, organization, email, subject, message) values ($1,$2,$3,$4,$5)";
  const values = [
    "Test visitor",
    "Test organization",
    "visitor@example.com",
    "Project Inquiry",
    "A real PostgreSQL RLS test",
  ];
  await role("anon");
  await db.query(insert, values);
  checks++;
  await denied("select * from public.contact_submissions");
  await denied("update public.contact_submissions set status = 'read'");
  await denied("delete from public.contact_submissions");
  await denied("select * from public.admin_users");
  await denied("insert into public.admin_users (user_id) values ($1)", [
    member,
  ]);
  await denied(
    "insert into public.contact_submissions (name,email,subject,message,status) values ('Visitor','test@example.com','Other','Test','contacted')",
  );
  await denied(
    "insert into public.contact_submissions (name,email,subject,message,created_at) values ('Visitor','test@example.com','Other','Test',now())",
  );
  await denied(insert, ["", "", "test@example.com", "Other", "Test"], "23514");
  await denied(
    insert,
    ["Visitor", "", "not-an-email", "Other", "Test"],
    "23514",
  );
  await denied(
    insert,
    ["Visitor", "", "test@example.com", "Unknown", "Test"],
    "23514",
  );
  await denied(
    insert,
    ["Visitor", "", "test@example.com", "Other", " ".repeat(5)],
    "23514",
  );
  await denied(
    insert,
    ["Visitor", "", "test@example.com", "Other", "x".repeat(5001)],
    "23514",
  );

  await role("authenticated", member);
  check(
    (await db.query("select * from public.contact_submissions")).rows.length,
    0,
  );
  check((await db.query("select * from public.admin_users")).rows.length, 0);
  check(
    (
      await db.query(
        "update public.contact_submissions set status = 'read' returning id",
      )
    ).rows.length,
    0,
  );
  check(
    (await db.query("delete from public.contact_submissions returning id")).rows
      .length,
    0,
  );
  await denied("insert into public.admin_users (user_id) values ($1)", [
    member,
  ]);
  await denied("update public.admin_users set user_id = $1", [member]);
  await db.query(insert, [
    "Signed-in visitor",
    "",
    "member@example.com",
    "Other",
    "Public form from a non-admin",
  ]);
  checks++;

  await role("authenticated", admin);
  const messages = (await db.query("select * from public.contact_submissions"))
    .rows;
  check(messages.length, 2);
  check(
    messages.every(
      (message) => message.status === "new" && message.id && message.created_at,
    ),
    true,
  );
  check((await db.query("select * from public.admin_users")).rows.length, 1);
  check(
    (
      await db.query(
        "update public.contact_submissions set status='read' where id=$1 returning status",
        [messages[0].id],
      )
    ).rows[0].status,
    "read",
  );
  check(
    (
      await db.query(
        "update public.contact_submissions set status='contacted' where id=$1 returning status",
        [messages[0].id],
      )
    ).rows[0].status,
    "contacted",
  );
  await denied("update public.contact_submissions set message='tampered'");
  await denied(
    "update public.contact_submissions set status='invalid'",
    [],
    "23514",
  );
  await denied("insert into public.admin_users (user_id) values ($1)", [
    member,
  ]);
  check(
    (
      await db.query(
        "delete from public.contact_submissions where id=$1 returning id",
        [messages[0].id],
      )
    ).rows.length,
    1,
  );
  await db.exec("reset role");
  await db.query("delete from public.admin_users where user_id=$1", [admin]);
  await role("authenticated", admin);
  check(
    (await db.query("select * from public.contact_submissions")).rows.length,
    0,
  );
  check(
    (await db.query("delete from public.contact_submissions returning id")).rows
      .length,
    0,
  );
  console.log(
    `PASS: ${checks} PostgreSQL checks — anonymous insert only, non-admin isolation, admin permissions, revocation, defaults, and validation.`,
  );
} finally {
  await db.close();
}
