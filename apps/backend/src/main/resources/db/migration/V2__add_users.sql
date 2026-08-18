create table users (
  id uuid not null,
  issuer varchar(255) not null,
  subject varchar(128) not null,
  created_at timestamptz not null default now(),
  primary key (id),
  constraint uk_users_issuer_subject unique (issuer, subject)
);

delete from statement_items;
delete from statements;
delete from items;

alter table items add column user_id uuid not null references users(id);
alter table statements add column user_id uuid not null references users(id);

drop index uk_items_name_upper;
create unique index uk_items_user_name_upper on items (user_id, upper(name));

alter table statements drop constraint uk_statements_statement_date;
alter table statements add constraint uk_statements_user_statement_date unique (user_id, statement_date);
