# Supabase Setup

Untuk menjalankan sistem ini, kamu perlu setup tabel dan aturan di Supabase terlebih dahulu.

## 1. Tabel `profiles`

Buat tabel `profiles` dengan struktur berikut:

```sql
create table profiles (
  id uuid references auth.users not null primary key,
  role text not null check (role in ('owner', 'frontdesk', 'desainer')),
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Buat policy untuk membaca profil sendiri
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

-- Buat trigger untuk otomatis membuat profile ketika user baru mendaftar
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, name)
  values (new.id, 'frontdesk', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## 2. Menambah User dan Mengatur Role

Untuk menambah user dan mengatur role:
1. Buka Supabase Dashboard -> Authentication -> Users
2. Tambah user baru (atau invite user)
3. Setelah user dibuat, buka tabel `profiles` dan ubah `role` sesuai kebutuhan (owner/frontdesk/desainer)
