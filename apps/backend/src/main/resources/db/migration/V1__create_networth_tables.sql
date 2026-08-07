create table items (
    id uuid not null,
    type varchar(20) not null check ((type in ('ASSET','LIABILITY'))),
    name varchar(100) not null,
    is_active boolean not null,
    primary key (id)
);

create unique index uk_items_name_upper on items (upper(name));

create table statements (
    id uuid not null,
    statement_date date not null,
    primary key (id),
    constraint uk_statements_statement_date unique (statement_date)
);

create table statement_items (
    id uuid not null,
    item_id uuid not null,
    statement_id uuid not null,
    amount_cents bigint not null,
    primary key (id),
    constraint uk_statement_items_statement_item unique (statement_id, item_id),
    constraint fk_statement_items_item foreign key (item_id) references items (id),
    constraint fk_statement_items_statement foreign key (statement_id) references statements (id) on delete cascade
);
