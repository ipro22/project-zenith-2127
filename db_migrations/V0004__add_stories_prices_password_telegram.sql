-- Истории (Stories)
CREATE TABLE IF NOT EXISTS t_p35950310_project_zenith_2127.stories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    subtitle VARCHAR(200),
    image_url TEXT NOT NULL,
    link_url TEXT,
    link_label VARCHAR(50) DEFAULT 'Подробнее',
    gradient_from VARCHAR(20) DEFAULT '#1d4ed8',
    gradient_to VARCHAR(20) DEFAULT '#7c3aed',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p35950310_project_zenith_2127.stories (title, subtitle, image_url, link_url, link_label, gradient_from, gradient_to, sort_order) VALUES
('Розыгрыш iPhone 17', 'Участвуй и выигрывай!', 'https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/bucket/d818cd17-a1fc-4556-96ac-9243e84e2d83.png', '/giveaway', 'Участвовать', '#f59e0b', '#ef4444', 0),
('Ремонт за 1 час', 'iPhone, Samsung, MacBook', 'https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/files/c08dc48b-2e30-4193-993a-56744db25416.jpg', '/device/iphone', 'Записаться', '#1d4ed8', '#0891b2', 1),
('Гарантия до 365 дней', 'На все виды ремонта', 'https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/files/c8e591d4-a6ab-46a8-bc4a-e7ffcf85a4e7.jpg', '/warranty', 'Узнать', '#059669', '#0891b2', 2),
('Бонусная программа', 'Скидки до 10%', 'https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/files/bae05299-9833-4cb6-854a-7024b8021cca.jpg', '/privileges', 'Подробнее', '#7c3aed', '#db2777', 3)
ON CONFLICT DO NOTHING;

-- Цены на услуги (редактируемые из админки)
CREATE TABLE IF NOT EXISTS t_p35950310_project_zenith_2127.service_prices (
    id SERIAL PRIMARY KEY,
    brand_slug VARCHAR(100) NOT NULL,
    brand_name VARCHAR(100) NOT NULL,
    model_slug VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    service_name VARCHAR(200) NOT NULL,
    price_text VARCHAR(100) NOT NULL,
    price_num INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(brand_slug, model_slug, service_name)
);

-- Клиентские пароли (для регистрации с паролем)
ALTER TABLE t_p35950310_project_zenith_2127.clients 
    ADD COLUMN IF NOT EXISTS password_hash VARCHAR(128),
    ADD COLUMN IF NOT EXISTS has_password BOOLEAN DEFAULT FALSE;

-- Токен Telegram для уведомлений
INSERT INTO t_p35950310_project_zenith_2127.site_content (section, key, value, type, label)
VALUES 
    ('telegram', 'bot_token', '', 'text', 'Токен Telegram-бота'),
    ('telegram', 'chat_id', '', 'text', 'Chat ID (группа/канал)')
ON CONFLICT (section, key) DO NOTHING;