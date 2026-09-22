# Supabase setup for ADPoly CyberGuard

The code and database migration are ready. A hosted Supabase project has **not** been created or configured. Complete these steps to make submissions live.

## 1. Create the project

Create a project in [Supabase](https://supabase.com/dashboard). Keep its database password in your password manager. Wait until the project is ready.

In its Connect dialog / API settings, copy the project URL and **anon / publishable** key. The existing environment-variable name `NEXT_PUBLIC_SUPABASE_ANON_KEY` accepts either the legacy anon key or the current publishable key. Never place a secret or service-role key in that variable.

## 2. Create the tables and access policies

Open the project's SQL Editor. Run the complete contents of:

`supabase/migrations/202609230001_contact_submissions.sql`

Run this migration once on the new project. It creates:

- `contact_submissions`: UUID `id`, `name`, optional `organization` (empty text by default), `email`, `subject`, `message`, `created_at` (timezone-aware timestamp, default `now()`), and `status` (default `new`).
- `admin_users`: an allowlist of approved Supabase Auth user UUIDs.
- Row Level Security on both tables, input constraints, indexes, and explicit grants.

Public visitors can insert only the five form fields. They cannot choose IDs, timestamps, or statuses, and cannot read, update, or delete messages. Signed-in non-admins likewise have no access to existing messages. Approved admins can read and delete messages and update only their status. No client can grant itself admin access.

## 3. Create your admin account

In Supabase **Authentication → Users**, create an email/password user for the team administrator. Use the dashboard's Add user / Create user option, set a strong password privately, and confirm the account. Do not share the password in source code or chat.

Copy that user's UUID. Run the following in the SQL Editor, replacing the placeholder:

```sql
insert into public.admin_users (user_id)
values ('YOUR_AUTH_USER_UUID');
```

Repeat for each approved administrator. Creating a Supabase Auth account alone does not grant dashboard access. There is no public signup flow in this site. For account recovery, use Supabase's dashboard to manage the account; no recovery page has been added to the site.

To revoke access, remove the corresponding membership:

```sql
delete from public.admin_users where user_id = 'YOUR_AUTH_USER_UUID';
```

Each protected request revalidates the user and membership. Database policies also check membership, so revocation does not depend on waiting for an old role claim to expire.

## 4. Configure the website

Copy `.env.example` to `.env.local` in the project root. Fill in:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_OR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Leave `SUPABASE_SERVICE_ROLE_KEY` empty. It is reserved for trusted administration and is **not used by this application**. All submissions and admin operations run through RLS using the public key and, for admins, their verified Supabase session. No privileged key is shipped to the browser.

`.env.local` is ignored by Git. On your deployment host, set the same URL/key variables and set `NEXT_PUBLIC_SITE_URL` to the real HTTPS website origin. Restart the development server after changes; rebuild and redeploy production after changing configuration.

```sh
npm install
npm run dev
```

Visit `http://localhost:3000/#contact` to send a message and `http://localhost:3000/admin/login` to sign in. The inbox is at `/admin/messages`.

## 5. Verify the live connection

1. Submit a contact message. Confirm the exact success text appears only after the insert succeeds, and inspect the saved row in Supabase.
2. Sign in with an approved admin. Check the message, the three statistics, search, subject filter, and newest/oldest sorting.
3. Open the full message, mark it read, then contacted. Refresh to confirm the state persisted.
4. Delete a disposable test message using the confirmation, then verify it is gone.
5. Sign out. `/admin/messages` must redirect to login. A signed-in user absent from `admin_users` must also be denied.

The dashboard uses pages of 20 messages. Statistics cover the entire inbox, independent of filters. “Messages Today” and displayed dates use **Asia/Dubai (UTC+4)**. “Mark as contacted” updates status; it does not send an email. Deletion is permanent and requires an in-dashboard confirmation.

## Tests and implementation

```sh
npm run test:rls
npm run test:integration
npm test
npm run build
```

`test:rls` executes the actual migration and permission checks in a local PostgreSQL WASM engine (PGlite), using minimal stand-ins for Supabase's Auth schema and roles. It does not touch a hosted project. Integration tests use a local Supabase API fixture, so they verify application requests and dashboard behavior without production data. These are not a substitute for the live-project checklist above.

The public form posts to `/api/contact`, which validates and inserts the five fields using an isolated anonymous Supabase client. A failed or unconfigured database returns an error, never a success or a browser-only draft. Admin routes check Supabase Auth with `getUser()` and membership in `admin_users`. Cookie sessions are HTTP-only, SameSite=Lax, and secure in production; authenticated pages and responses are not cached. Mutations check request origin. The SQL policies protect direct Supabase API access too.

Implementation follows Supabase's [server-side auth guide](https://supabase.com/docs/guides/auth/server-side/creating-a-client) and [RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security).
