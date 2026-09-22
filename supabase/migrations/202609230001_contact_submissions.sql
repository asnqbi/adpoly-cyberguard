begin;

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  organization text not null default '' check (char_length(organization) <= 180),
  email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  subject text not null check (subject in ('Competition Invitation', 'Collaboration', 'Project Inquiry', 'Media', 'Other')),
  message text not null check (char_length(btrim(message)) between 1 and 5000),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'read', 'contacted'))
);

-- Only a project owner using the SQL Editor / a trusted server may maintain this list.
-- Never grant admin rights through user-editable Auth metadata.
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;
alter table public.admin_users enable row level security;

revoke all on public.contact_submissions from public, anon, authenticated;
revoke all on public.admin_users from public, anon, authenticated;

grant insert (name, organization, email, subject, message) on public.contact_submissions to anon, authenticated;
grant select, delete on public.contact_submissions to authenticated;
grant update (status) on public.contact_submissions to authenticated;
grant select on public.admin_users to authenticated;
grant all on public.contact_submissions, public.admin_users to service_role;

create policy "Users can check their own admin membership"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Public may submit new messages"
  on public.contact_submissions for insert to anon, authenticated
  with check (status = 'new');

create policy "Admins can read messages"
  on public.contact_submissions for select to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins can update message status"
  on public.contact_submissions for update to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins can delete messages"
  on public.contact_submissions for delete to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create index contact_submissions_created_idx on public.contact_submissions (created_at desc, id desc);
create index contact_submissions_status_idx on public.contact_submissions (status);
create index contact_submissions_subject_idx on public.contact_submissions (subject);

commit;
