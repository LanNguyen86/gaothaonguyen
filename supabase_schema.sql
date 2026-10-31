-- ==============================================================================
-- SCHEMA & SEED DATA CHO VỰA GẠO THẢO NGUYÊN (SUPABASE POSTGRESQL)
-- Hướng dẫn: Mở Supabase Dashboard -> SQL Editor -> Dán toàn bộ file này -> Nhấn Run
-- ==============================================================================

-- 1. BẢNG SẢN PHẨM (PRODUCTS)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    category TEXT[] DEFAULT '{}',
    badge TEXT,
    badge_type TEXT DEFAULT 'default',
    packaging_snippet TEXT,
    texture_badge TEXT,
    desc_text TEXT,
    image_url TEXT,
    origin TEXT,
    texture JSONB DEFAULT '{"softness": 5, "aroma": 5, "fluffiness": 2}'::jsonb,
    water_ratio TEXT,
    suitable_for TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG ĐƠN HÀNG (ORDERS)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code TEXT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    rice_name TEXT NOT NULL,
    quantity_kg NUMERIC NOT NULL,
    unit_price NUMERIC NOT NULL,
    shipping_fee NUMERIC DEFAULT 0,
    total_price NUMERIC NOT NULL,
    packaging TEXT,
    note TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG CẤU HÌNH & THÔNG TIN CỬA HÀNG (STORE_SETTINGS)
CREATE TABLE IF NOT EXISTS public.store_settings (
    key TEXT PRIMARY KEY,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- BẢO MẬT & PHÂN QUYỀN TRUY CẬP (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view products" 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Public can view store settings" 
ON public.store_settings FOR SELECT USING (true);

CREATE POLICY "Public can insert orders" 
ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update products" 
ON public.products FOR ALL USING (true);

CREATE POLICY "Allow view & update orders" 
ON public.orders FOR ALL USING (true);

CREATE POLICY "Allow update settings" 
ON public.store_settings FOR ALL USING (true);

-- ==============================================================================
-- NẠP DỮ LIỆU BAN ĐẦU (SEED DATA - 13 LOẠI GẠO)
-- ==============================================================================

INSERT INTO public.products (id, name, price, category, badge, badge_type, packaging_snippet, texture_badge, desc_text, image_url, origin, texture, water_ratio, suitable_for, display_order)
VALUES
(
    'st25-lua-tom',
    'ST25 Lúa Tôm Ông Cua',
    28000,
    ARRAY['premium', 'family'],
    'BÁN CHẠY NHẤT ★★★★★',
    'secondary',
    'Túi 5kg • 10kg • 25kg',
    'Dẻo Nhiều • Thơm Dứa',
    'Gạo ngon nhất thế giới. Hạt gạo thon dài, nấu cơm dẻo dai tự nhiên, ngọt đậm sâu, để nguội vẫn mềm thơm.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCgNx_DMD24PnqYVFxm3xJKAozO9ApO-HvO18TpF2HyVRuPBMsIebEbQ5iybw6JYn2mZHXHomhcNbDTOorc5RhKJoKzmsieHO2Mb5untARzothGTTOMKheVSHA5K464eLc6DsrkAkoCUXvMl3x8O1oPrsL2-66YgfgdVTSmEiUgzz3CeqPrQhXWvBN0oT6KQ1XtZy4lIWHpZrCKmlUHApmk4iUGXLcSo4vKqVqcGV4E',
    'DNTN Hồ Quang Trí - Sóc Trăng',
    '{"softness":5,"aroma":5,"fluffiness":2}'::jsonb,
    '1 bát gạo : 1 đến 1.1 bát nước (ít nước)',
    'Gia đình cao cấp, người già, trẻ nhỏ, mâm cơm tiệc, nhà hàng cơm niêu cao cấp.',
    1
),
(
    'tai-nguyen-cho-dao',
    'Tài Nguyên Chợ Đào',
    22000,
    ARRAY['premium', 'commercial'],
    'Đặc Sản Long An',
    'default',
    'Bao 10kg • 25kg • 50kg',
    'Xốp Mềm • Ngọt Cơm',
    'Dòng gạo xốp mềm trứ danh vùng Chợ Đào. Cơm nở đều xốp, tơi mềm, thích hợp người thích cơm chan canh hoặc làm cơm chiên.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBctnF0YR1VMhVYW_uEAsf2DnKMtYMG9w53AoZHk4RpBYVzGKgwk_FV8nT7RkPH4tTazD6f-db2d8D_geaM1mqec_lvESKXeByqGAnHElpoYdCN6liYK-_BSR9-PvYGbSWlUKuv42OIVKa8B82bbtVsnEwNAZZcJMW-vfti2GOAbk6IsYHyUH_NG8CO2kWownkNymCeQqaYHE0SpYWww1KYhBdfdHDdey-M6CLwK1do',
    'Long An',
    '{"softness":3,"aroma":3,"fluffiness":4}'::jsonb,
    '1 bát gạo : 1.25 bát nước',
    'Người thích cơm xốp mềm dễ tiêu hóa, quán cơm trưa văn phòng, quán ăn đông khách.',
    2
),
(
    'st21-thom-dac-biet',
    'ST21 Thơm Đặc Biệt',
    20000,
    ARRAY['premium', 'family'],
    'Gia Đình Ưa Chuộng',
    'primary',
    'Túi 5kg • 10kg • 25kg',
    'Dẻo Ngọt • Thơm Đậm Đà',
    'Hạt gạo nhỏ, thon dài, mùi thơm ngọt hoa lài dịu dàng. Cơm nấu dẻo ngọt đậm đà, giữ độ mềm dẻo tuyệt vời tới tận chiều tối.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC7UWQOnMPXme1QZeVOzk_9nwIFousMc4aAbGqp_gy1rYrNsWtmhuOjh5S42LZcmb_AvtFPXYwqOZj5G7-4tZadZbyvAkiMIMsKXf5U5uzqOTkzXAZUQbgOqIPy4dpnM_1LUFB06F9nFXEZe5P4iV9xkOjIIOU8wxj02Ec6e1cSzhwEiPSwyvS4c3ckQletallonKLFOYa4vWF3p_2wWMCa2xOuwxYRtGyYlv9fqe6k',
    'Sóc Trăng',
    '{"softness":4,"aroma":4,"fluffiness":2}'::jsonb,
    '1 bát gạo : 1.1 đến 1.15 bát nước',
    'Gia đình yêu thích cơm dẻo mềm không nhão, ăn cơm ngày 2-3 bữa.',
    3
),
(
    'gao-nang-hoa',
    'Gạo Nàng Hoa',
    20000,
    ARRAY['family'],
    'Hương Thơm Dịu',
    'default',
    'Túi 5kg • 10kg • 25kg',
    'Dẻo Mềm • Hương Hoa',
    'Hạt gạo trắng trong, cơm dẻo mềm óng ả, tỏa hương hoa thoang thoảng khi vừa sôi nắp. Rất được trẻ nhỏ và người lớn tuổi ưa thích.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAhragbd9oQ7rgR5ZPb547zcCdbH-hgG8DNpW7nmgOs-5wAlqNohJaEnDiy6gsny6ETQu9iDCFdbW7XDDvsirtD_aCfC09O9yQT1xg4rMAHmjymOdKiNmxBsUXFyaJH0NFzretcY21bp9qfry5E_3AJyiwrA703xO3BiK3Xpv6miN3YsrQtsjKjJBKjlmeFCadT7LK2xhTlB30DKXYGCIe9hMNfsjzdIp_mZijM_VpT',
    'Đồng Bằng Sông Cửu Long',
    '{"softness":4,"aroma":4,"fluffiness":2}'::jsonb,
    '1 bát gạo : 1.1 bát nước',
    'Mọi lứa tuổi trong gia đình, cơm cuộn, cơm nắm dã ngoại.',
    4
),
(
    'nep-ngong-thuong-hang',
    'Nếp Ngỗng Thượng Hạng',
    19000,
    ARRAY['glutinous'],
    'Chuyên Nấu Xôi & Bánh',
    'secondary',
    'Túi 2kg • 5kg • 10kg',
    'Dẻo Quánh • Bóng Hạt',
    'Hạt to tròn như trứng ngỗng thu nhỏ, màu trắng sữa. Nấu xôi dẻo quánh, hạt bóng đẹp không bị nát, làm bánh tét bánh chưng chuẩn vị.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuARPzlig5jf6RaO_jFDUzCAalwFXlsFZdPjzByDLnZlEpc7BwH6P2pXZw1iyjAim79wcY-T8HiGEAxZ90HjEdVfje-dyB82MnJ4cm5MNi7ZbR8qW0YPdgQXkCqECqiS2v9xwr6QZ3X36LEcvoiMTXbo2SHbrO9oy5uu9UFRxF2K7Rz_FVSFKCdj10cP8sYvr3kpyZTzD-5Sc1FLyHUM2WZOGmuRhrrNeku_MbZmofO6',
    'Miền Tây',
    '{"softness":5,"aroma":4,"fluffiness":1}'::jsonb,
    'Ngâm nước ấm 2-4 tiếng trước khi hấp / đồ xôi',
    'Nấu xôi gấc, xôi vò, làm bánh chưng, bánh tét ngày rằm, giỗ chạp, ngày lễ.',
    5
),
(
    'gao-nang-huong',
    'Gạo Nàng Hương',
    18000,
    ARRAY['family'],
    'Thơm Lừng Gian Bếp',
    'default',
    'Bao 10kg • 25kg',
    'Nở Đều • Mềm Cơm',
    'Hạt gạo đều đặn, khi chín nở vừa vặn, thơm ngát gian bếp. Hạt cơm mềm ráo, dễ ăn, phù hợp bữa cơm thường nhật của gia đình Việt.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAdxNIdOjb9BwR8XO4vCwkdzg63wR-y89uyH9c2YBhTHAnfzYG0m3wUN5TSvY7zzIBOGZJSIhfY85BST3PWjqc3ZR4j6z0n7tqN4GEzwu3i2zdWCPp5fa3EWCn0Ddep00waRn16JQSOkkPQrXVLzwcWZ9vGCqMrTkndLWlKvgTymfnfQxmUnviRxCOZvLgLuT-GwRxOeKS7mcR6HF-2mc46N0bktzCAKQ2i0BGzN3io',
    'Long An',
    '{"softness":4,"aroma":5,"fluffiness":2}'::jsonb,
    '1 bát gạo : 1 đến 1.15 bát nước',
    'Bữa cơm đầm ấm gia đình, quán cơm niêu truyền thống.',
    6
),
(
    'gao-sa-mo',
    'Gạo Sa Mơ',
    18000,
    ARRAY['commercial'],
    'Chuyên Quán Cơm',
    'secondary',
    'Bao 25kg • 50kg',
    'Dẻo Vừa • Ráo Cơm',
    'Đặc tính dẻo vừa, ráo hạt, không bị nhão dính. Rất được các quán cơm tấm, cơm trưa văn phòng và bếp ăn tập thể tin dùng.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAa1VVLffUc0Lcb7F8SwY2OIM2BLf2jm2uv9IeiE426QuJ2duKyn1wtO2PbFv738Pyoz77SY5Vo_WyEZznp_470B6Dc99pbbAVjEUm4R4qecPk1xocrQPovmy7p8SIrItRD4jLcoeJx2sdgmnM4sL59AbU8wzNZMI23RjdQofjyw6l0UyBp8enTO4DgASw99o6JjnC1sTxdMcDvvy6dMzTKqpRyxtgT9gaydYWUW-PO',
    'An Giang',
    '{"softness":3,"aroma":3,"fluffiness":4}'::jsonb,
    '1 bát gạo : 1.2 bát nước',
    'Quán cơm tấm, quán cơm trưa văn phòng, căng tin trường học.',
    7
),
(
    'gao-bui-sua',
    'Gạo Bụi Sữa',
    18000,
    ARRAY['family'],
    'Hạt Sữa Đục',
    'default',
    'Túi 10kg • 25kg',
    'Mềm Ngậy • Dễ Nấu',
    'Hạt gạo có màu đục như sữa, chứa nhiều tinh bột bùi thơm. Nấu chín hạt nở đều, vị béo ngậy thanh nhẹ, rất đưa cơm với món kho.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDS_fc7-dwoTzUNus1HdVkTgR0NNyfRti0aFPV33kzrXr_Ln3xE11Zmb3jTEUhBvjhhPS-sUdroC_zH0U4b5CRckiRJ1sjkvIf4U8nt-B_DUJhNbgjG-SegTSgCAkym_VQsgib3iO4mXDEhx4zynXggfrHzvIjRkCdtd37wfAhSVJgLfBGaRHfSiyFAhgVov1aDzjtGZSy0vcvC8b5MpxHgceZQZaIiydgBCfL9rFX2',
    'Tiền Giang',
    '{"softness":4,"aroma":3,"fluffiness":3}'::jsonb,
    '1 bát gạo : 1.15 bát nước',
    'Gia đình thích cơm mềm ngọt bùi, ăn kèm thịt kho tàu, cá kho tộ.',
    8
),
(
    'gao-thom-deo-lai',
    'Gạo Thơm Dẻo Lài',
    17000,
    ARRAY['family'],
    'Mềm Dẻo Kinh Tế',
    'default',
    'Túi 5kg • 10kg • 25kg',
    'Dẻo Thanh • Mát Miệng',
    'Hạt gạo đều, mềm dẻo thanh mát, không ngấy. Là sự lựa chọn kinh tế hàng đầu cho các hộ gia đình yêu thích cơm dẻo giá phải chăng.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBEMSnV8wctf7zweYRC4KAg9lDYSBi1wQ0qzmQx8ZwaBJOF6_W4QDgNhObuP9EKUh8fWywGRa23-PVyNcllMu7ZqDRvy3DHpmNDb9u5DcSh-zF1Ap7oEgU2S2OEjFnGGVQDgdpgQj5UWmySHc3bbrd93YiNo0ICH6MFpIql0AW3VvmKzeZgoPY3wcQ_Mt-V61TBG6X6zyaiVnW_Re8JVivJorLCvEDn5Qk6N9l_0i5M',
    'Long An',
    '{"softness":4,"aroma":4,"fluffiness":2}'::jsonb,
    '1 bát gạo : 1.15 bát nước',
    'Mọi gia đình bình dân muốn ăn cơm dẻo thơm với mức giá tiết kiệm.',
    9
),
(
    'gao-64-dua',
    'Gạo 64 Dứa',
    17000,
    ARRAY['commercial'],
    'Cơm Trưa Văn Phòng',
    'secondary',
    'Bao 25kg • 50kg',
    'Nở Xốp • Mềm Cơm',
    'Nở xốp mềm cơm, độ lợi cơm rất cao. Rất được các quán cơm bình dân, cơm phần văn phòng lựa chọn nhằm tối ưu chi phí và độ ngon miệng.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB5DoMETYSxM0ocK96NgaqkFHUKJV9AXc1nkbcnuUeTxMPPbIxRlQy5h-ONz6PG30IJgT4VlBxXb0MkZnrispumYRpe5A5FauGcZbjkT-zpF-8aMhlmekX3QdTTlIPDIi8yrvMnTJj_0KtHk_DghK7cO-Uv694JxWDhnOyFS8Cd-7DrUlWOR_xlmJGPxG9lQVsUCkZb8pO3pJNKoFohpkzZeWDssf_PLPCOjprlmqwf',
    'Đồng Tháp',
    '{"softness":3,"aroma":3,"fluffiness":4}'::jsonb,
    '1 bát gạo : 1.3 bát nước (nở nhiều, dôi cơm)',
    'Công ty suất ăn công nghiệp, quán cơm bình dân, bếp ăn tập thể.',
    10
),
(
    'gao-ham-chau',
    'Gạo Hàm Châu',
    17000,
    ARRAY['commercial'],
    'Chuẩn Cơm Chiên & Bánh',
    'default',
    'Bao 25kg • 50kg',
    'Xốp Tơi • Không Dính',
    'Hạt xốp tơi ráo tuyệt đối, không vón cục khi xào rang. Đặc biệt thích hợp quán cơm chiên Dương Châu, làm bún phở, bánh xèo giòn rụm.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA0_PTFB8UE3lx4Igl6dc6b6nhm8nGafNt75byFGYiul6cz6bEyf2KrQnM-Ch_lX3e06DXx_h0gkwMLK8H4XWPxn2wspSEDakLnU717DqWgsgahQ9uIgZHEI0SAWFL3B5NPNW_xNDaoqG2rHOvZ0wxsc1rYMnkfjZNmOeYpdY6wppjWlFPp5z0RFADmSUAegQ-MIWWuu2HK9nlREVvp8uEBUv9g8k1CrpVbZ6xdfcoY',
    'Tây Nam Bộ',
    '{"softness":2,"aroma":2,"fluffiness":5}'::jsonb,
    '1 bát gạo : 1.35 bát nước',
    'Quán cơm rang / cơm chiên Dương Châu, cơ sở tráng bánh cuốn, làm bún, bánh xèo.',
    11
),
(
    'gao-tam-thom',
    'Gạo Tấm Thơm',
    16000,
    ARRAY['glutinous', 'commercial'],
    'Cơm Tấm Sườn Bì',
    'secondary',
    'Bao 10kg • 25kg • 50kg',
    'Mầm Giàu Dinh Dưỡng',
    'Hạt tấm gãy tự nhiên giữ nguyên đầu phôi mầm lúa thơm ngọt, ngậy béo. Nấu cơm tấm nở mềm thơm phức, đậm đà chuẩn vị Sài Gòn.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuALYUjfQG5bA7R3TAb0lOIe-l8UVa0VqCgzWwWH-k02c0-fEzLF5Kxr-yeIaa8s3miiOSrxLBcWqmHGdyH8ojlkGEgv9Wzbbi0z_Rn4Wz-13or4Ns7fRK_K8U3lRwtVlT4CqHkAlaXEPw9i62mBigsBY9CPL_QQ0grlMhHuZf403thUB0PYjj3M6gcZBFxYdeLaCHZrDglIfY2V9O6m1ZbPTg_AT8d1gW2cT0jiFkxc',
    'Đồng Bằng Sông Cửu Long',
    '{"softness":4,"aroma":4,"fluffiness":3}'::jsonb,
    '1 bát tấm : 1 đến 1.1 bát nước',
    'Quán cơm tấm đêm, cơm tấm sườn bì chả truyền thống, bữa ăn gia đình.',
    12
),
(
    'gao-no-mem',
    'Gạo Nở Mềm',
    16000,
    ARRAY['commercial'],
    'Kinh Tế Siêu Lợi Cơm',
    'default',
    'Bao 25kg • 50kg',
    'Nở Nhiều • Mềm Cơm',
    'Dòng gạo giá bình dân, hạt nở nhiều rất dôi cơm nhưng vẫn giữ được độ mềm ẩm. Rất thích hợp bếp ăn công nghiệp và từ thiện.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDoeLqf-FW_nA60z5eTh8m8YjXp86edneSZlySHkqvKNKjF-a8kq9k7rmmDr1wyRi3iwzjvUPvJv4Mf5R0ceRt9A8WMw3Y7QrRUSwj0NmJmokSVeTAbEc2RTZxPH__zzpUQI0iEiEmZASlPSjZoYq5LO1ntrMFimuHbWEopwLGDhSeYZqp7MCkkXIUtsE7mMb1HkVKSD5Hr3PE0hNGJtgKlEtQ00RbZHYfmOhSTZ9tD',
    'Miền Tây',
    '{"softness":3,"aroma":2,"fluffiness":5}'::jsonb,
    '1 bát gạo : 1.35 bát nước',
    'Đơn vị từ thiện đóng bao phát quà, bếp ăn nhà xưởng, khu chế xuất.',
    13
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    category = EXCLUDED.category,
    badge = EXCLUDED.badge,
    badge_type = EXCLUDED.badge_type,
    packaging_snippet = EXCLUDED.packaging_snippet,
    texture_badge = EXCLUDED.texture_badge,
    desc_text = EXCLUDED.desc_text,
    image_url = EXCLUDED.image_url,
    origin = EXCLUDED.origin,
    texture = EXCLUDED.texture,
    water_ratio = EXCLUDED.water_ratio,
    suitable_for = EXCLUDED.suitable_for,
    display_order = EXCLUDED.display_order,
    updated_at = NOW();

-- NẠP CẤU HÌNH CỬA HÀNG (STORE SETTINGS)
INSERT INTO public.store_settings (key, content)
VALUES
(
    'storeInfo',
    '{
  "name": "Vựa Gạo Thảo Nguyên",
  "subName": "Nông Sản Thảo Nguyên",
  "slogan": "Gạo ngon – Chất lượng – Trọn niềm tin",
  "announcement": "🌾 Cam kết 100% Gạo Mới Đầu Mùa - Không Đấu Trộn - Giữ Trọn Vị Tự Nhiên",
  "hotline": "0979.123.789",
  "hotlineClean": "0979123789",
  "contactPerson": "Chị Thảo",
  "zaloUrl": "https://zalo.me/0979123789",
  "address": "586 Hà Huy Giáp, Phường Thạnh Lộc, Quận 12, TP.HCM",
  "googleMapsUrl": "https://www.google.com/maps/dir/?api=1&destination=586+H%C3%A0+Huy+Gi%C3%A1p,+Th%E1%BA%A1nh+L%E1%BB%99c,+Qu%E1%BA%ADn+12,+H%E1%BB%93+Ch%C3%AD+Minh",
  "openingHours": "06:30 - 20:30 (Mở cửa tất cả các ngày trong tuần)",
  "deliveryCoverage": "Phủ sóng toàn bộ các quận huyện TP.HCM và vùng phụ cận (Hỗ trợ vác lên tận bếp)",
  "freeShipThresholdKg": 20,
  "defaultShippingFee": 20000,
  "logoUrl": "/logo.png",
  "ownerAvatarUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuCbUyGQGMUfCrenYloreO7MGb8egIJa3t3GrcVv7KcDs4mzS4k6-WqLvh-XcwenHforSgW_rihPfPTiBIWzTYa1aYhCDSoOvrtYJ2q_Vck08dugl_SfatJfQactlMscs3xZ21yhHX9zsWeaLzhoc5jqQhZuNJCVTboto2E1ghbgt2jV-Zqqj_wKc_frApU62YUjNHiyRyRac1whNDthKZmFUrXCXHRRYQ5ca3T5ShEL",
  "heroBgUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuA-tPeebb8VfIo_o3ePiungsIKiJlFW6AP8l148MhiaYBwi_kvVyFRmjH5jlyzPdSspoRxqdIyF2NxF8bdL9j4Ekr3yTMBOnBG5HS6-01lvr_NYJUhgN3yrS4X_QsT4TFePu01NMvxHbfYjs0UrYSki2hy_CYo19f5GdTuiS8WzoljjMtzAxFcysUIJx_hHiefjWRdbgmMm29DzlfA3R78dLgcXnWnQMh1bfm7CiUBr",
  "heroCookedBowlUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuAp7Sl5oAY1bGLnMSLN55K7AxLnPr4zrUq3M0stKShZX4RWYVT36CFjJoF0xseNBhslOFJpXB-EWFuUDU3dSjjah-liL-04_1kD_fKJLmeXRMNaalQnTzAzeyE7bD9QoQMcHSueQ2UBPUfWsVeFLkAi6pcHWv3MPmS0Sj2eBWonwExtDa-Ozg3JnX2RZ25K4rvlYt6GsS84-3xT9vi_3ceZ4FnNMz0gycLwYIQcFfmU",
  "spotlightSt25BagUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuCEc_OP9nWkSRYNM03XT0g3vb5FFxOXLu_oAXqjUXMcz9oe63s3SWU6Q3cr3nEailCDX9_WXVhvwoKF9pMcxFUDsuBbF1rafIlvkVvzOzFlr9BlS48h6I7tBKWcTqOA88QCS2fvZolnEcLGUGzQ7YNfVoqQxPymkZPlqct-7EFl6g7FjeLrR-E1RzP2k5OepYO22NqKvxz4um5tR2-GkPuexitIOr151q3D-KBy8_GU"
}'::jsonb
),
(
    'heroContent',
    '{
  "badgeAuthorized": "ĐẠI LÝ ỦY QUYỀN GẠO ÔNG CUA CHÍNH HÃNG SÓC TRĂNG",
  "badgeDelivery": "Giao Bếp Nóng Trong 2H",
  "subhead": "VỰA GẠO THẢO NGUYÊN • NÔNG SẢN SẠCH TẬN TÂM",
  "headlinePart1": "Dẻo Thơm Từng Hạt,",
  "headlinePart2": "Trọn Vị Yêu Thương",
  "description": "Chuyên cung cấp gạo sạch thượng hạng cho hộ gia đình, chuỗi nhà hàng, quán ăn và bếp ăn bán trú. Cam kết 100% lúa mùa mới chuẩn vị, hạt ngọc tinh khôi không tẩy trắng, không ướp hương, hỗ trợ vác lên tận căn hộ trong 2 giờ.",
  "metric1Value": "13+",
  "metric1Label": "Loại Gạo Thơm Thuần Chủng",
  "metric2Value": "100%",
  "metric2Label": "Lúa Mới • Không Đấu Trộn",
  "metric3Value": "2 Giờ",
  "metric3Label": "Giao Tận Tủ Bếp TP.HCM",
  "cardTag": "Gạo Ngon Thế Giới",
  "cardTitle": "ST25 Ông Cua Lúa - Tôm",
  "cardSubtitle": "Vị ngọt tự nhiên, dẻo dai nguyên hạt, hương lá dứa thoang thoảng",
  "microCardLabel": "Tiêu chuẩn canh tác",
  "microCardValue": "An Toàn VietGAP"
}'::jsonb
),
(
    'spotlightST25',
    '{
  "tag": "DANH VỊ: GẠO NGON NHẤT THẾ GIỚI",
  "title": "Chuyên Phân Phối Gạo ST25",
  "titleHighlight": "Kỹ Sư Hồ Quang Cua Chính Hiệu",
  "description": "ST25 là niềm tự hào của lúa gạo Việt Nam, được lai tạo và tuyển chọn công phu bởi Anh Hùng Lao Động - Kỹ sư Hồ Quang Cua và nhóm cộng sự tại Sóc Trăng. Vựa Gạo Thảo Nguyên cam kết cung cấp đúng chuẩn nguồn gốc, niêm phong nguyên bản của DNTN Hồ Quang Trí.",
  "feature1Title": "Tem QR Chống Giả 100%",
  "feature1Desc": "Quét mã kiểm tra số seri độc bản từng bao",
  "feature2Title": "Bao Bì Có Dấu Độc Quyền",
  "feature2Desc": "Đầy đủ logo thương hiệu và địa chỉ Sóc Trăng",
  "packagingList": [
    "Hộp 2kg Hút Chân Không (Biếu Tặng)",
    "Túi 5kg Gia Đình Tiêu Chuẩn",
    "Túi 5kg ST25 Lúa - Tôm Đặc Biệt",
    "Bao 25kg Nhà Hàng"
  ],
  "gaugeSoftness": 9.8,
  "gaugeAroma": 9.5,
  "gaugeSweetness": 9.9,
  "priceRetail": 28000
}'::jsonb
),
(
    'trustBadges',
    '[
  {
    "icon": "agriculture",
    "iconBg": "bg-emerald-100",
    "iconColor": "text-[#0d631b]",
    "title": "Gạo Mới 100% Không Pha Trộn",
    "desc": "Trực tiếp từ các cánh đồng phù sa màu mỡ thu hoạch vụ mới nhất. Tuyệt đối không đấu trộn gạo cũ, giữ trọn độ dẻo bóng và vị ngọt thanh hậu vị.",
    "highlight": "Mùi cám mới nguyên bản",
    "highlightColor": "text-[#0d631b]"
  },
  {
    "icon": "health_and_safety",
    "iconBg": "bg-amber-100",
    "iconColor": "text-[#855300]",
    "title": "Không Hóa Chất & Tẩy Trắng",
    "desc": "Không xịt hương liệu nhân tạo, không dùng chất bảo quản chống mọt mốc. Quy trình xay xát tự nhiên đạt chuẩn vệ sinh an toàn thực phẩm.",
    "highlight": "An tâm cho người già & trẻ nhỏ",
    "highlightColor": "text-[#855300]"
  },
  {
    "icon": "verified",
    "iconBg": "bg-teal-100",
    "iconColor": "text-[#006874]",
    "title": "ST25 Ông Cua Chính Hãng",
    "desc": "Nhập trực tiếp từ DNTN Hồ Quang Trí (Sóc Trăng). Đầy đủ tem cào chống hàng giả, mã QR xác thực nguồn gốc minh bạch rõ ràng.",
    "highlight": "Đền 200% nếu phát hiện giả",
    "highlightColor": "text-[#006874]"
  },
  {
    "icon": "electric_moped",
    "iconBg": "bg-blue-100",
    "iconColor": "text-[#0061a4]",
    "title": "Giao Tận Nơi Siêu Tốc 2H",
    "desc": "Đội giao hàng vựa gạo năng động, nhiệt tình. Miễn phí ship cho đơn từ 20kg trong nội thành TP.HCM, hỗ trợ vác lên chung cư, đổ vào thùng gạo tận bếp.",
    "highlight": "Đổi trả 1-1 miễn phí nếu không dẻo",
    "highlightColor": "text-[#0d631b]"
  }
]'::jsonb
),
(
    'calculatorConfig',
    '{
  "freeShipThresholdKg": 20,
  "defaultShippingFee": 20000,
  "presetKgs": [
    5,
    10,
    20,
    50,
    100
  ]
}'::jsonb
),
(
    'b2bContent',
    '{
  "badge": "DÀNH CHO DOANH NGHIỆP & QUÁN ĂN",
  "title": "Chính Sách Giá Sỉ & Chiết Khấu Định Kỳ",
  "description": "Bạn là chủ quán cơm, nhà hàng, bếp ăn công ty, trường học hay đơn vị tổ chức từ thiện? Vựa Gạo Thảo Nguyên luôn có chính sách trợ giá tốt nhất thị trường, xuất hóa đơn VAT đầy đủ và ổn định giá xuyên suốt mùa vụ.",
  "box1Title": "Từ 1 Bao (25kg)",
  "box1Desc": "Chiết khấu trực tiếp theo đơn giá bán buôn cạnh tranh nhất khu vực.",
  "box2Title": "Hóa Đơn VAT",
  "box2Desc": "Hỗ trợ hợp đồng kinh tế và xuất hóa đơn điện tử hợp lệ nhanh gọn.",
  "box3Title": "Tặng Quà Tháng",
  "box3Desc": "Tặng gia vị, dầu ăn hoặc chiết khấu tích lũy cho hợp đồng đều đặn.",
  "consultTitle": "Cần Báo Giá Sỉ Cho Doanh Nghiệp?",
  "consultDesc": "Chị Thảo tư vấn trực tiếp và gửi mẫu gạo thử tận nơi hoàn toàn miễn phí."
}'::jsonb
),
(
    'warehouseContent',
    '{
  "badge": "Ghé Thăm Kho Gạo Trực Tiếp",
  "title": "Vựa Gạo Thảo Nguyên",
  "description": "Kính mời quý khách tới trực tiếp kho xem mẫu gạo thực tế, ngửi hương cám mới và thử độ dẻo trước khi đặt số lượng lớn.",
  "address": "586 Hà Huy Giáp, Phường Thạnh Lộc, Quận 12, TP.HCM",
  "openingHours": "06:30 - 20:30 (Mở cửa tất cả các ngày trong tuần)",
  "deliveryCoverage": "Phủ sóng toàn bộ các quận huyện TP.HCM và vùng phụ cận (Hỗ trợ vác lên tận bếp)",
  "parkingNote": "Mặt tiền đường Hà Huy Giáp, xe tải bốc hàng và xe máy đỗ thuận tiện",
  "googleMapsEmbed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.443673327686!2d106.68481537480587!3d10.853835889299496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e12d8a571f%3A0x6bc4ea20f012b1cb!2zNTg2IEjDoCBIdXkgR2nhuYFwLCBUaOG6oW5oIEzhu5ljLCBRdeG6rW4gMTIsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1711000000000!5m2!1svi!2s"
}'::jsonb
)
ON CONFLICT (key) DO UPDATE SET
    content = EXCLUDED.content,
    updated_at = NOW();

-- ==============================================================================
-- 4. KHO LƯU TRỮ HÌNH ẢNH (SUPABASE STORAGE BUCKET 'images')
-- ==============================================================================

-- Tạo bucket 'images' công khai cho phép lưu ảnh sản phẩm, logo, banner
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'images',
    'images',
    true,
    10485760, -- Tối đa 10MB
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Cho phép mọi người xem ảnh công khai
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access Images'
    ) THEN
        CREATE POLICY "Public Access Images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
    END IF;
END $$;

-- Cho phép upload ảnh lên bucket 'images'
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Upload Images'
    ) THEN
        CREATE POLICY "Public Upload Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
    END IF;
END $$;

-- Cho phép ghi đè / cập nhật ảnh trong bucket 'images'
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Update Images'
    ) THEN
        CREATE POLICY "Public Update Images" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
    END IF;
END $$;

