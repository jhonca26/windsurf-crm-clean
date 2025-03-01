-- Create clients table
create table if not exists public.clients (
    id bigint primary key generated always as identity,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    full_name text not null,
    email text,
    phone text,
    experience_level text check (experience_level in ('Principiante', 'Intermedio', 'Avanzado')),
    status text default 'Activo' check (status in ('Activo', 'Inactivo')),
    notes text,
    user_id uuid references auth.users(id)
);

-- Enable RLS
alter table public.clients enable row level security;

-- Create policies
create policy "Users can view their own clients"
    on public.clients for select
    using (auth.uid() = user_id);

create policy "Users can insert their own clients"
    on public.clients for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own clients"
    on public.clients for update
    using (auth.uid() = user_id);

create policy "Users can delete their own clients"
    on public.clients for delete
    using (auth.uid() = user_id);
