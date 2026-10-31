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
    status TEXT DEFAULT 'pending', -- 'pending' (Chờ xác nhận), 'confirmed', 'delivering', 'completed', 'cancelled'
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

-- Cho phép mọi khách truy cập (Anonymous) xem danh mục gạo và cấu hình trang
CREATE POLICY "Public can view products" 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Public can view store settings" 
ON public.store_settings FOR SELECT USING (true);

-- Cho phép khách đặt đơn hàng mới
CREATE POLICY "Public can insert orders" 
ON public.orders FOR INSERT WITH CHECK (true);

-- Cho phép xem và cập nhật nếu là quản trị viên hoặc dùng anon key trong giai đoạn đầu
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
    '{"softness": 5, "aroma": 5, "fluffiness": 2}'::jsonb,
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
    'Vùng đất Chợ Đào - Cần Đước, Long An',
    '{"softness": 2, "aroma": 3, "fluffiness": 5}'::jsonb,
    '1 bát gạo : 1.3 đến 1.4 bát nước',
    'Quán cơm bình dân, cơm chiên Dương Châu cao cấp, gia đình thích ăn khô ráo chan canh.',
    2
),
(
    'st21-dac-san',
    'ST21 Thơm Đặc Sản',
    20000,
    ARRAY['family', 'premium'],
    'Gia Đình Yêu Thích',
    'secondary',
    'Túi 5kg • 10kg • Bao 25kg',
    'Dẻo Ngọt • Thơm Nhẹ',
    'Hạt gạo nhỏ dài, cơm dẻo mềm dai, vị ngọt thanh tự nhiên và hương hoa lài dịu dàng trong từng chén cơm.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBC2wXFw1o6V03zB5j8QyqZ_Qe3-d7n6Z9C2x5X_Qe3-d7n6Z9C2x5X_Qe3',
    'Sóc Trăng (Giống lúa ST chọn lọc)',
    '{"softness": 4, "aroma": 4, "fluffiness": 2}'::jsonb,
    '1 bát gạo : 1 đến 1.2 bát nước',
    'Bữa cơm gia đình hàng ngày, trường mầm non chất lượng cao, bếp ăn văn phòng.',
    3
),
(
    'nang-hoa-9',
    'Gạo Nàng Hoa 9',
    20000,
    ARRAY['family', 'premium'],
    'Dẻo Thơm Tự Nhiên',
    'default',
    'Túi 5kg • 10kg • 25kg',
    'Dẻo Vừa • Thơm Lài',
    'Hạt gạo thon tròn, màu trắng trong, khi nấu tỏa hương thơm hoa lài nồng nàn. Cơm dẻo mềm, để qua đêm không khô cứng.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCgNx_DMD24PnqYVFxm3xJKAozO9ApO-HvO18TpF2HyVRuPBMsIebEbQ5iybw6JYn2mZHXHomhcNbDTOorc5RhKJoKzmsieHO2Mb5untARzothGTTOMKheVSHA5K464eLc6DsrkAkoCUXvMl3x8O1oPrsL2-66YgfgdVTSmEiUgzz3CeqPrQhXWvBN0oT6KQ1XtZy4lIWHpZrCKmlUHApmk4iUGXLcSo4vKqVqcGV4E',
    'Đồng bằng sông Cửu Long',
    '{"softness": 4, "aroma": 4, "fluffiness": 2}'::jsonb,
    '1 bát gạo : 1.1 đến 1.2 bát nước',
    'Bữa cơm gia đình tiêu chuẩn, quán cơm niêu, nhà hàng tiệc cưới.',
    4
),
(
    'lai-sua-thuong-hang',
    'Lài Sữa Thượng Hạng',
    19000,
    ARRAY['family'],
    'Thơm Mùi Cám Sữa',
    'default',
    'Bao 10kg • 25kg',
    'Dẻo Mềm • Béo Bùi',
    'Hạt gạo trắng đục màu sữa, thơm ngậy mùi sữa lúa non. Cơm nấu xong dẻo mềm sánh hạt, vị béo nhẹ dễ ăn.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBctnF0YR1VMhVYW_uEAsf2DnKMtYMG9w53AoZHk4RpBYVzGKgwk_FV8nT7RkPH4tTazD6f-db2d8D_geaM1mqec_lvESKXeByqGAnHElpoYdCN6liYK-_BSR9-PvYGbSWlUKuv42OIVKa8B82bbtVsnEwNAZZcJMW-vfti2GOAbk6IsYHyUH_NG8CO2kWownkNymCeQqaYHE0SpYWww1KYhBdfdHDdey-M6CLwK1do',
    'Vùng đất phù sa Tiền Giang',
    '{"softness": 4, "aroma": 4, "fluffiness": 2}'::jsonb,
    '1 bát gạo : 1.1 bát nước',
    'Gia đình có trẻ em, người thích cơm dẻo mềm béo bùi.',
    5
),
(
    'thom-lai-dong-thap',
    'Thơm Lài Đồng Tháp',
    18000,
    ARRAY['family'],
    'Chuẩn Cơm Gia Đình',
    'default',
    'Bao 10kg • 25kg • 50kg',
    'Dẻo Vừa • Dễ Nấu',
    'Độ dẻo vừa phải, thơm thoang thoảng, hạt gạo đều đặn sạch bóng. Rất dễ canh nước và phù hợp mọi lứa tuổi trong gia đình.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCgNx_DMD24PnqYVFxm3xJKAozO9ApO-HvO18TpF2HyVRuPBMsIebEbQ5iybw6JYn2mZHXHomhcNbDTOorc5RhKJoKzmsieHO2Mb5untARzothGTTOMKheVSHA5K464eLc6DsrkAkoCUXvMl3x8O1oPrsL2-66YgfgdVTSmEiUgzz3CeqPrQhXWvBN0oT6KQ1XtZy4lIWHpZrCKmlUHApmk4iUGXLcSo4vKqVqcGV4E',
    'Đồng Tháp Mười',
    '{"softness": 3, "aroma": 3, "fluffiness": 3}'::jsonb,
    '1 bát gạo : 1.2 bát nước',
    'Hộ gia đình, bếp ăn tập thể cơ quan, căng tin trường học.',
    6
),
(
    'bac-huong-hai-hau',
    'Bắc Hương Hải Hậu',
    18000,
    ARRAY['family', 'premium'],
    'Hương Vị Miền Bắc',
    'default',
    'Túi 5kg • 10kg • 25kg',
    'Dẻo Dính • Đậm Đà',
    'Đặc sản Bắc Bộ chính gốc. Hạt gạo nhỏ hơi dẹt, cơm dẻo dính tự nhiên, vị ngọt đậm đà khó quên.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBctnF0YR1VMhVYW_uEAsf2DnKMtYMG9w53AoZHk4RpBYVzGKgwk_FV8nT7RkPH4tTazD6f-db2d8D_geaM1mqec_lvESKXeByqGAnHElpoYdCN6liYK-_BSR9-PvYGbSWlUKuv42OIVKa8B82bbtVsnEwNAZZcJMW-vfti2GOAbk6IsYHyUH_NG8CO2kWownkNymCeQqaYHE0SpYWww1KYhBdfdHDdey-M6CLwK1do',
    'Hải Hậu - Nam Định',
    '{"softness": 5, "aroma": 4, "fluffiness": 1}'::jsonb,
    '1 bát gạo : 1.1 bát nước',
    'Người gốc Bắc xa quê, người thích cơm đậm vị dẻo dính truyền thống.',
    7
),
(
    'nep-cai-hoa-vang',
    'Nếp Cái Hoa Vàng',
    28000,
    ARRAY['glutinous'],
    'Nếp Tiến Vua Thượng Hạng',
    'secondary',
    'Gói 1kg • 2kg • Bao 10kg',
    'Cực Dẻo • Thơm Lừng',
    'Hạt nếp tròn mẩy, thơm lừng hương cốm non. Đồ xôi dẻo quánh bóng mượt, làm bánh chưng xanh ngắt chuẩn vị truyền thống.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCgNx_DMD24PnqYVFxm3xJKAozO9ApO-HvO18TpF2HyVRuPBMsIebEbQ5iybw6JYn2mZHXHomhcNbDTOorc5RhKJoKzmsieHO2Mb5untARzothGTTOMKheVSHA5K464eLc6DsrkAkoCUXvMl3x8O1oPrsL2-66YgfgdVTSmEiUgzz3CeqPrQhXWvBN0oT6KQ1XtZy4lIWHpZrCKmlUHApmk4iUGXLcSo4vKqVqcGV4E',
    'Kinh Môn - Hải Dương',
    '{"softness": 5, "aroma": 5, "fluffiness": 1}'::jsonb,
    'Ngâm nước 6-8 tiếng trước khi đồ xôi',
    'Đồ xôi cúng lễ, gói bánh chưng tết, nấu chè hạt sen, ngâm ủ rượu nếp.',
    8
),
(
    'tam-thom-dac-biet',
    'Tấm Thơm Đặc Biệt',
    17000,
    ARRAY['glutinous', 'commercial'],
    'Chuyên Cơm Tấm Sườn',
    'default',
    'Bao 10kg • 25kg • 50kg',
    'Dẻo Thơm • Ngọt Bùi',
    'Đầu phôi hạt gạo tấm gãy tự nhiên giàu vitamin. Nấu cơm tấm nở mềm thơm ngát, ăn cùng sườn nướng mỡ hành chuẩn vị Sài Gòn.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBctnF0YR1VMhVYW_uEAsf2DnKMtYMG9w53AoZHk4RpBYVzGKgwk_FV8nT7RkPH4tTazD6f-db2d8D_geaM1mqec_lvESKXeByqGAnHElpoYdCN6liYK-_BSR9-PvYGbSWlUKuv42OIVKa8B82bbtVsnEwNAZZcJMW-vfti2GOAbk6IsYHyUH_NG8CO2kWownkNymCeQqaYHE0SpYWww1KYhBdfdHDdey-M6CLwK1do',
    'Đồng Tháp / Long An',
    '{"softness": 3, "aroma": 3, "fluffiness": 3}'::jsonb,
    '1 bát tấm : 1 bát nước (hấp xửng ngon nhất)',
    'Quán cơm tấm đêm, nhà hàng sườn bì chả, gia đình nấu cháo dinh dưỡng.',
    9
),
(
    'gao-thom-thai-nhap',
    'Gạo Thơm Thái',
    17000,
    ARRAY['family'],
    'Hương Vị Phổ Thông',
    'default',
    'Bao 10kg • 25kg • 50kg',
    'Mềm Cơm • Ráo Hạt',
    'Hạt dài đều đặn, màu sắc trắng bóng tự nhiên. Cơm nấu chín mềm vừa, thơm thoang thoảng, giá thành vô cùng kinh tế.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCgNx_DMD24PnqYVFxm3xJKAozO9ApO-HvO18TpF2HyVRuPBMsIebEbQ5iybw6JYn2mZHXHomhcNbDTOorc5RhKJoKzmsieHO2Mb5untARzothGTTOMKheVSHA5K464eLc6DsrkAkoCUXvMl3x8O1oPrsL2-66YgfgdVTSmEiUgzz3CeqPrQhXWvBN0oT6KQ1XtZy4lIWHpZrCKmlUHApmk4iUGXLcSo4vKqVqcGV4E',
    'Vùng nguyên liệu xuất khẩu ĐBSCL',
    '{"softness": 3, "aroma": 3, "fluffiness": 3}'::jsonb,
    '1 bát gạo : 1.2 bát nước',
    'Bữa cơm gia đình tiết kiệm, bếp ăn công nghiệp, căng tin xí nghiệp.',
    10
),
(
    'gao-ham-chau',
    'Gạo Hàm Châu',
    16000,
    ARRAY['commercial'],
    'Chuyên Làm Bún Bánh',
    'default',
    'Bao 25kg • 50kg',
    'Nở Xốp Nhiều • Ráo Nước',
    'Dòng gạo nở xốp nhiều, hàm lượng tinh bột cao. Đặc biệt được các lò bún, tiệm bánh phở, quán cơm chiên và bếp ăn tập thể tin dùng.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBctnF0YR1VMhVYW_uEAsf2DnKMtYMG9w53AoZHk4RpBYVzGKgwk_FV8nT7RkPH4tTazD6f-db2d8D_geaM1mqec_lvESKXeByqGAnHElpoYdCN6liYK-_BSR9-PvYGbSWlUKuv42OIVKa8B82bbtVsnEwNAZZcJMW-vfti2GOAbk6IsYHyUH_NG8CO2kWownkNymCeQqaYHE0SpYWww1KYhBdfdHDdey-M6CLwK1do',
    'An Giang',
    '{"softness": 1, "aroma": 2, "fluffiness": 5}'::jsonb,
    '1 bát gạo : 1.5 bát nước',
    'Cơm chiên, lò làm bún, bánh cuốn, bánh tráng, nhà máy chế biến thực phẩm.',
    11
),
(
    'gao-504-cu',
    'Gạo 504 Cũ (Nở Xốp)',
    16000,
    ARRAY['commercial'],
    'Giá Rẻ - Tiết Kiệm',
    'default',
    'Bao 50kg sỉ',
    'Nở Xốp Cực Đại',
    'Gạo để kho 4-6 tháng cho ráo nhựa, khi nấu nở bung xốp tối đa lợi cơm. Là giải pháp tiết kiệm chi phí số 1 cho các quán cơm bình dân.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCgNx_DMD24PnqYVFxm3xJKAozO9ApO-HvO18TpF2HyVRuPBMsIebEbQ5iybw6JYn2mZHXHomhcNbDTOorc5RhKJoKzmsieHO2Mb5untARzothGTTOMKheVSHA5K464eLc6DsrkAkoCUXvMl3x8O1oPrsL2-66YgfgdVTSmEiUgzz3CeqPrQhXWvBN0oT6KQ1XtZy4lIWHpZrCKmlUHApmk4iUGXLcSo4vKqVqcGV4E',
    'Đồng bằng sông Cửu Long',
    '{"softness": 1, "aroma": 1, "fluffiness": 5}'::jsonb,
    '1 bát gạo : 1.5 đến 1.6 bát nước',
    'Quán cơm bình dân, xuất ăn công nghiệp giá rẻ, làm nguyên liệu rang xay.',
    12
),
(
    'gao-lut-do-huyet-rong',
    'Gạo Lứt Đỏ Huyết Rồng',
    30000,
    ARRAY['premium'],
    'Thực Dưỡng Khỏe Đẹp',
    'default',
    'Túi 1kg • 2kg hút chân không',
    'Bùi Ngậy • Giàu Dưỡng Chất',
    'Lớp cám dày đỏ thẫm giàu anthocyanin, vitamin B và khoáng chất. Thích hợp cho người ăn kiêng, tiểu đường, thực dưỡng thanh lọc cơ thể.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBctnF0YR1VMhVYW_uEAsf2DnKMtYMG9w53AoZHk4RpBYVzGKgwk_FV8nT7RkPH4tTazD6f-db2d8D_geaM1mqec_lvESKXeByqGAnHElpoYdCN6liYK-_BSR9-PvYGbSWlUKuv42OIVKa8B82bbtVsnEwNAZZcJMW-vfti2GOAbk6IsYHyUH_NG8CO2kWownkNymCeQqaYHE0SpYWww1KYhBdfdHDdey-M6CLwK1do',
    'Đồng Tháp Mười',
    '{"softness": 3, "aroma": 3, "fluffiness": 2}'::jsonb,
    'Ngâm nước ấm 2-4 tiếng trước khi nấu',
    'Người ăn kiêng giảm cân, người bệnh tiểu đường, gia đình ăn thực dưỡng Eat Clean.',
    13
)
ON CONFLICT (id) DO NOTHING;

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
        "openingHours": "06:30 - 20:30 (Mở cửa tất cả các ngày trong tuần)",
        "deliveryCoverage": "Phủ sóng toàn bộ các quận huyện TP.HCM và vùng phụ cận (Hỗ trợ vác lên tận bếp)",
        "freeShipThresholdKg": 20,
        "defaultShippingFee": 20000,
        "logoUrl": "/logo.png"
    }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
