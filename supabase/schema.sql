-- ayalmeyers.com private area. Run in the Supabase SQL editor.
--
-- Admin: the Supabase Auth user ayal@meyerslink.com (signs in on the site as "ADM").
--        Works with the tables directly; row level security lets only that user in.
-- Members: not Supabase Auth users. They request access with a name, email, note and password
--        (stored as a bcrypt hash). Once approved, they sign in through the functions below,
--        which hand back a random session token (stored only as a hash, 30-day expiry).
--        Every member action goes through a function that checks that token.
-- Visitors with the public key can do nothing except call these functions.

create extension if not exists pgcrypto with schema extensions;

drop table if exists public.messages, public.comments, public.posts, public.member_sessions, public.members cascade;

create table public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null unique check (char_length(email) between 3 and 320),
  note text not null default '' check (char_length(note) <= 4000),
  pw_hash text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table public.member_sessions (
  token_hash text primary key,
  member_id uuid not null references public.members (id) on delete cascade,
  expires_at timestamptz not null default now() + interval '30 days'
);

create table public.posts (
  id bigint generated always as identity primary key,
  body text not null check (char_length(body) between 1 and 20000),
  created_at timestamptz not null default now()
);

create table public.comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.posts (id) on delete cascade,
  member_id uuid references public.members (id) on delete cascade,   -- null when written by the admin
  author_name text not null,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create table public.messages (
  id bigint generated always as identity primary key,
  member_id uuid not null references public.members (id) on delete cascade,
  from_admin boolean not null default false,
  body text not null check (char_length(body) between 1 and 8000),
  created_at timestamptz not null default now()
);

create index comments_post_idx on public.comments (post_id, created_at);
create index messages_member_idx on public.messages (member_id, created_at);
create index sessions_member_idx on public.member_sessions (member_id);

-- ---------- admin access (Supabase Auth) ----------
create or replace function public.is_admin() returns boolean
language sql stable as $$ select coalesce(auth.jwt() ->> 'email', '') = 'ayal@meyerslink.com' $$;

alter table public.members enable row level security;
alter table public.member_sessions enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.messages enable row level security;

create policy "admin: members" on public.members for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin: posts" on public.posts for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin: comments" on public.comments for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin: messages" on public.messages for all to authenticated using (public.is_admin()) with check (public.is_admin());
-- member_sessions: no policies, so nobody reads it directly

revoke all on public.members, public.member_sessions, public.posts, public.comments, public.messages from anon, authenticated;
grant select, update, delete on public.members to authenticated;
grant select, insert, update, delete on public.posts, public.comments, public.messages to authenticated;

-- ---------- member functions (called with the public key) ----------
create or replace function public.session_member(p_token text) returns public.members
language plpgsql stable security definer set search_path = public, extensions as $$
declare m public.members;
begin
  select mem.* into m from public.member_sessions s join public.members mem on mem.id = s.member_id
   where s.token_hash = encode(digest(p_token, 'sha256'), 'hex') and s.expires_at > now() and mem.status = 'approved';
  if m.id is null then raise exception 'not signed in' using errcode = '28000'; end if;
  return m;
end $$;

create or replace function public.request_access(p_name text, p_email text, p_note text, p_password text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  if char_length(coalesce(p_password, '')) < 8 then raise exception 'password too short'; end if;
  insert into public.members (name, email, note, pw_hash)
  values (trim(p_name), lower(trim(p_email)), coalesce(trim(p_note), ''), crypt(p_password, gen_salt('bf', 10)))
  on conflict (email) do nothing;
  return true;
end $$;

create or replace function public.member_login(p_email text, p_password text) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare m public.members; tok text;
begin
  select * into m from public.members where email = lower(trim(p_email));
  if m.id is null or m.pw_hash <> crypt(p_password, m.pw_hash) then return null; end if;
  if m.status = 'pending' then return json_build_object('status', 'pending'); end if;
  if m.status <> 'approved' then return null; end if;
  delete from public.member_sessions where member_id = m.id and expires_at < now();
  tok := encode(gen_random_bytes(32), 'hex');
  insert into public.member_sessions (token_hash, member_id) values (encode(digest(tok, 'sha256'), 'hex'), m.id);
  return json_build_object('status', 'approved', 'token', tok, 'name', m.name);
end $$;

create or replace function public.member_logout(p_token text) returns void
language sql security definer set search_path = public, extensions as $$
  delete from public.member_sessions where token_hash = encode(digest(p_token, 'sha256'), 'hex');
$$;

create or replace function public.member_me(p_token text) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
declare m public.members := public.session_member(p_token);
begin return json_build_object('name', m.name); end $$;

create or replace function public.member_feed(p_token text) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
declare m public.members := public.session_member(p_token);
begin
  return coalesce((select json_agg(json_build_object(
      'id', p.id, 'body', p.body, 'created_at', p.created_at,
      'comments', coalesce((select json_agg(json_build_object('id', c.id, 'author_name', c.author_name, 'body', c.body, 'created_at', c.created_at, 'mine', c.member_id = m.id) order by c.created_at)
                            from public.comments c where c.post_id = p.id), '[]'::json)
    ) order by p.created_at desc) from public.posts p), '[]'::json);
end $$;

create or replace function public.member_comment(p_token text, p_post_id bigint, p_body text) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare m public.members := public.session_member(p_token);
begin
  insert into public.comments (post_id, member_id, author_name, body) values (p_post_id, m.id, m.name, trim(p_body));
end $$;

create or replace function public.member_delete_comment(p_token text, p_comment_id bigint) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare m public.members := public.session_member(p_token);
begin
  delete from public.comments where id = p_comment_id and member_id = m.id;
end $$;

create or replace function public.member_thread(p_token text) returns json
language plpgsql stable security definer set search_path = public, extensions as $$
declare m public.members := public.session_member(p_token);
begin
  return coalesce((select json_agg(json_build_object('from_admin', x.from_admin, 'body', x.body, 'created_at', x.created_at) order by x.created_at)
                   from public.messages x where x.member_id = m.id), '[]'::json);
end $$;

create or replace function public.member_send(p_token text, p_body text) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare m public.members := public.session_member(p_token);
begin
  insert into public.messages (member_id, from_admin, body) values (m.id, false, trim(p_body));
end $$;

-- Only these functions are callable by visitors
revoke all on function public.session_member(text) from public, anon, authenticated;
grant execute on function public.request_access(text, text, text, text), public.member_login(text, text), public.member_logout(text),
  public.member_me(text), public.member_feed(text), public.member_comment(text, bigint, text), public.member_delete_comment(text, bigint),
  public.member_thread(text), public.member_send(text, text) to anon, authenticated;
