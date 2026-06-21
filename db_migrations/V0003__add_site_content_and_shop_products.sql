-- Таблица для хранения редактируемого контента сайта
CREATE TABLE IF NOT EXISTS t_p35950310_project_zenith_2127.site_content (
    id SERIAL PRIMARY KEY,
    section VARCHAR(100) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'text',
    label VARCHAR(200),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(section, key)
);

-- Заполняем дефолтными значениями
INSERT INTO t_p35950310_project_zenith_2127.site_content (section, key, value, type, label) VALUES
-- Hero секция
('hero', 'title_line1', 'Ремонт техники', 'text', 'Заголовок строка 1'),
('hero', 'title_line2', 'Apple и других брендов', 'text', 'Заголовок строка 2'),
('hero', 'subtitle', 'Профессиональный ремонт iPhone, iPad, MacBook, Samsung, Xiaomi. Диагностика бесплатно. Ремонт в день обращения.', 'textarea', 'Подзаголовок'),
('hero', 'badge_hours', 'Пн–Пт 11–20 · Сб 12–18', 'text', 'Значок: режим работы'),
('hero', 'badge_warranty', 'Гарантия до 365 дней', 'text', 'Значок: гарантия'),
-- Контакты
('contacts', 'phone', '+7 (999) 323-18-17', 'text', 'Телефон'),
('contacts', 'address', 'г. Барнаул, ул. Молодёжная 34', 'text', 'Адрес'),
('contacts', 'hours_weekdays', 'Пн–Пт: 11:00 – 20:00', 'text', 'Режим работы будни'),
('contacts', 'hours_saturday', 'Сб: 12:00 – 18:00', 'text', 'Режим работы суббота'),
('contacts', 'hours_sunday', 'Воскресенье — выходной', 'text', 'Режим работы воскресенье'),
-- Программа лояльности
('loyalty', 'standard_percent', '5', 'number', 'Стандарт % бонусов'),
('loyalty', 'regular_percent', '7', 'number', 'Постоянный % бонусов'),
('loyalty', 'vip_percent', '10', 'number', 'VIP % бонусов'),
('loyalty', 'regular_min_visits', '3', 'number', 'Постоянный: мин. визитов'),
('loyalty', 'vip_min_visits', '5', 'number', 'VIP: мин. визитов'),
-- SEO
('seo', 'site_name', 'iPro Барнаул', 'text', 'Название сайта'),
('seo', 'site_description', 'Сервисный центр по ремонту Apple и другой техники в центре Барнаула.', 'textarea', 'Описание сайта'),
-- О компании
('about', 'years_on_market', '10+', 'text', 'Лет на рынке'),
('about', 'clients_count', '3000+', 'text', 'Клиентов'),
('about', 'warranty_days', 'до 365', 'text', 'Гарантия (дней)'),
('about', 'repair_time', '1–2 ч', 'text', 'Время ремонта')
ON CONFLICT (section, key) DO NOTHING;

-- Таблица для товаров магазина (редактируемая)
CREATE TABLE IF NOT EXISTS t_p35950310_project_zenith_2127.shop_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    category VARCHAR(100),
    description TEXT,
    price INTEGER NOT NULL DEFAULT 0,
    old_price INTEGER,
    image_url TEXT,
    badge VARCHAR(50),
    in_stock BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);