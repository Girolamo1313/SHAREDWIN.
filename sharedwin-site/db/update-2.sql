-- SharedWin update 2: custom markets, contact messages, chat. Safe to run more than once.

alter table matches add column if not exists title      text;
alter table matches add column if not exists has_draw   boolean not null default true;
alter table matches add column if not exists draw_label text;

create table if not exists contact_messages (
  id         bigserial primary key,
  name       text not null,
  email      text not null,
  message    text not null,
  ip         text,
  created_at timestamptz not null default now()
);

create table if not exists chat_messages (
  id         bigserial primary key,
  user_id    uuid not null references users(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 200),
  created_at timestamptz not null default now()
);
create index if not exists chat_created_idx on chat_messages(created_at desc);
create index if not exists contact_created_idx on contact_messages(created_at desc);

alter table contact_messages enable row level security;
alter table chat_messages enable row level security;
