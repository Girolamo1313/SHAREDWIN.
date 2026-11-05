-- SharedWin schema (PostgreSQL / Supabase). Safe to run more than once.
-- All money amounts are INTEGER CENTS (1 coin = 100 cents) to avoid float errors.

create extension if not exists pgcrypto;

create table if not exists users (
  id             uuid primary key default gen_random_uuid(),
  username       text not null check (char_length(username) between 3 and 16),
  username_lower text generated always as (lower(username)) stored,
  email          text not null,
  email_lower    text generated always as (lower(email)) stored,
  password_hash  text not null,
  balance_cents  integer not null default 0 check (balance_cents >= 0),
  is_admin       boolean not null default false,
  created_at     timestamptz not null default now(),
  unique (username_lower),
  unique (email_lower)
);

create table if not exists matches (
  id               bigserial primary key,
  sport            text not null,
  league           text not null,
  home             text not null,
  away             text not null,
  kickoff_at       timestamptz not null,
  max_players      integer not null default 100 check (max_players between 2 and 1000),
  commission_bps   integer not null default 500 check (commission_bps between 0 and 5000), -- 500 = 5%
  status           text not null default 'open' check (status in ('open','finished')),
  result           char(1) check (result in ('H','D','A')),
  pool_cents       integer,   -- filled at settlement
  fee_cents        integer,
  net_cents        integer,
  win_stake_cents  integer,
  refunded         boolean not null default false,
  settled_at       timestamptz,
  created_at       timestamptz not null default now()
);

create table if not exists bets (
  id            bigserial primary key,
  user_id       uuid not null references users(id) on delete cascade,
  match_id      bigint not null references matches(id) on delete cascade,
  pick          char(1) not null check (pick in ('H','D','A')),
  stake_cents   integer not null check (stake_cents > 0),
  status        text not null default 'pending' check (status in ('pending','won','lost','refunded')),
  payout_cents  integer not null default 0,
  created_at    timestamptz not null default now(),
  unique (user_id, match_id)            -- ONE bet per user per match
);

create table if not exists transactions (
  id            bigserial primary key,
  user_id       uuid not null references users(id) on delete cascade,
  type          text not null check (type in ('bonus','deposit','withdraw','stake','payout','refund')),
  amount_cents  integer not null,       -- signed
  note          text,
  created_at    timestamptz not null default now()
);

create index if not exists bets_match_idx on bets(match_id);
create index if not exists bets_user_idx on bets(user_id, created_at desc);
create index if not exists tx_user_idx on transactions(user_id, created_at desc);
create index if not exists matches_status_idx on matches(status, kickoff_at);

-- Supabase: the app connects with a server-side Postgres role, so lock the tables
-- away from the public REST API (PostgREST).
alter table users enable row level security;
alter table matches enable row level security;
alter table bets enable row level security;
alter table transactions enable row level security;
