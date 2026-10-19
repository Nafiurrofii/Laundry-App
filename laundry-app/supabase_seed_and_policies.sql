-- ====================================================================
-- SCRIPT SINKRONISASI & SEED DATABASE SUPABASE (LAUNDRY APP)
-- Jalankan seluruh script ini di Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. BUAT USER ADMIN SISTEM DI auth.users & public.users
DO $$
DECLARE
    default_user_id UUID := 'a0000000-0000-0000-0000-000000000001';
BEGIN
    -- Masukkan ke auth.users
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
        created_at, updated_at
    )
    VALUES (
        default_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'admin@laundry.id',
        crypt('Admin12345!', gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Admin Laundry"}',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    -- Masukkan ke public.users
    INSERT INTO public.users (user_id, username, name, role)
    VALUES (default_user_id, 'admin', 'Admin Laundry', 'admin')
    ON CONFLICT (user_id) DO UPDATE 
    SET role = 'admin', name = 'Admin Laundry';
END $$;


-- 2. SEED DATA LAYANAN (services)
INSERT INTO public.services (service_id, service_name, price_per_kg, is_active)
OVERRIDING SYSTEM VALUE
VALUES 
    (1, 'Cuci Setrika', 8000, true),
    (2, 'Cuci Kering', 6000, true),
    (3, 'Cuci Basah', 4000, true)
ON CONFLICT (service_id) DO UPDATE 
SET service_name = EXCLUDED.service_name, price_per_kg = EXCLUDED.price_per_kg, is_active = EXCLUDED.is_active;

SELECT setval(pg_get_serial_sequence('public.services', 'service_id'), COALESCE(MAX(service_id), 1)) FROM public.services;


-- 3. SEED DATA PELANGGAN (customers)
INSERT INTO public.customers (customer_id, name, phone_number, address)
OVERRIDING SYSTEM VALUE
VALUES 
    (1, 'Aulia Putri', '081234567801', 'Jl. Merpati No. 12'),
    (2, 'Bima Pratama', '081234567802', 'Jl. Melati No. 5'),
    (3, 'Citra Lestari', '081234567803', 'Jl. Kenanga No. 8'),
    (4, 'Dimas Saputra', '081234567804', 'Jl. Mawar No. 17'),
    (5, 'Eka Wulandari', '081234567805', 'Jl. Anggrek No. 3'),
    (6, 'Farah Nabila', '081234567806', 'Jl. Dahlia No. 21')
ON CONFLICT (customer_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.customers', 'customer_id'), COALESCE(MAX(customer_id), 1)) FROM public.customers;


-- 4. SEED DATA TRANSAKSI CUCIAN (transactions)
INSERT INTO public.transactions (
    transaction_id, receipt_number, customer_id, service_id, user_id, 
    weight_kg, clothing_type, price_per_kg, total_price, status, 
    payment_status, payment_method, amount_paid, received_at, completed_at, picked_up_at, paid_at
)
OVERRIDING SYSTEM VALUE
VALUES
    (128, 'BLS-0128', 1, 1, 'a0000000-0000-0000-0000-000000000001', 6.0, 'Pakaian Umum', 8000, 48000, 'Processing', 'Paid', 'QRIS', 48000, NOW() - INTERVAL '2 hours', NULL, NULL, NOW() - INTERVAL '2 hours'),
    (127, 'BLS-0127', 2, 2, 'a0000000-0000-0000-0000-000000000001', 4.0, 'Pakaian Umum', 6000, 24000, 'Processing', 'Unpaid', NULL, 0, NOW() - INTERVAL '3 hours', NULL, NULL, NULL),
    (126, 'BLS-0126', 3, 3, 'a0000000-0000-0000-0000-000000000001', 5.0, 'Pakaian Umum', 4000, 20000, 'Completed', 'Paid', 'QRIS', 20000, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '1 hour', NULL, NOW() - INTERVAL '5 hours'),
    (125, 'BLS-0125', 4, 1, 'a0000000-0000-0000-0000-000000000001', 8.0, 'Pakaian Kerja', 8000, 64000, 'Completed', 'Paid', 'QRIS', 64000, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '2 hours', NULL, NOW() - INTERVAL '6 hours'),
    (124, 'BLS-0124', 5, 2, 'a0000000-0000-0000-0000-000000000001', 3.0, 'Pakaian Umum', 6000, 18000, 'Received', 'Unpaid', NULL, 0, NOW() - INTERVAL '7 hours', NULL, NULL, NULL),
    (123, 'BLS-0123', 6, 1, 'a0000000-0000-0000-0000-000000000001', 10.0, 'Pakaian Umum', 8000, 80000, 'Picked Up', 'Paid', 'QRIS', 80000, NOW() - INTERVAL '8 hours', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '8 hours')
ON CONFLICT (transaction_id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.transactions', 'transaction_id'), COALESCE(MAX(transaction_id), 128)) FROM public.transactions;


-- 5. SEED DATA RIWAYAT STATUS (status_history)
INSERT INTO public.status_history (transaction_id, status, user_id, changed_at)
VALUES
    (128, 'Received', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 hours'),
    (128, 'Processing', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1.5 hours'),
    (127, 'Received', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 hours'),
    (127, 'Processing', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2.5 hours'),
    (126, 'Received', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '5 hours'),
    (126, 'Completed', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 hour'),
    (125, 'Received', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '6 hours'),
    (125, 'Completed', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 hours'),
    (124, 'Received', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '7 hours'),
    (123, 'Received', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '8 hours'),
    (123, 'Completed', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '4 hours'),
    (123, 'Picked Up', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 hour');


-- 6. PERBARUI KEBIJAKAN ROW LEVEL SECURITY (RLS)
-- Mengizinkan aplikasi web membaca dan menulis data transaksi, pelanggan, layanan secara langsung

-- TRANSACTIONS
DROP POLICY IF EXISTS "Public read transactions" ON public.transactions;
DROP POLICY IF EXISTS "Public insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "Public update transactions" ON public.transactions;
DROP POLICY IF EXISTS "Public delete transactions" ON public.transactions;

CREATE POLICY "Public read transactions" ON public.transactions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert transactions" ON public.transactions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update transactions" ON public.transactions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public delete transactions" ON public.transactions FOR DELETE TO anon, authenticated USING (true);

-- CUSTOMERS
DROP POLICY IF EXISTS "Public read customers" ON public.customers;
DROP POLICY IF EXISTS "Public insert customers" ON public.customers;
DROP POLICY IF EXISTS "Public update customers" ON public.customers;

CREATE POLICY "Public read customers" ON public.customers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert customers" ON public.customers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update customers" ON public.customers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- SERVICES
DROP POLICY IF EXISTS "Public read services" ON public.services;
DROP POLICY IF EXISTS "Public insert services" ON public.services;
DROP POLICY IF EXISTS "Public update services" ON public.services;

CREATE POLICY "Public read services" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert services" ON public.services FOR INSERT TO anon, authenticated WITH CHECK (true);

-- STATUS_HISTORY
DROP POLICY IF EXISTS "Public read status_history" ON public.status_history;
DROP POLICY IF EXISTS "Public insert status_history" ON public.status_history;

CREATE POLICY "Public read status_history" ON public.status_history FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert status_history" ON public.status_history FOR INSERT TO anon, authenticated WITH CHECK (true);

-- USERS
DROP POLICY IF EXISTS "Public read users" ON public.users;
CREATE POLICY "Public read users" ON public.users FOR SELECT TO anon, authenticated USING (true);

-- REALTIME REPLICATION ENABLE
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
