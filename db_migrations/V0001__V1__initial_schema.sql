-- Clients table
CREATE TABLE t_p35950310_project_zenith_2127.clients (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(150),
    yandex_id VARCHAR(100),
    yandex_login VARCHAR(100),
    yandex_avatar_url TEXT,
    bonus_balance INTEGER DEFAULT 0,
    loyalty_level VARCHAR(20) DEFAULT 'standard',
    visits_count INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Repair orders table
CREATE TABLE t_p35950310_project_zenith_2127.repair_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(30) UNIQUE NOT NULL,
    client_id INTEGER REFERENCES t_p35950310_project_zenith_2127.clients(id),
    client_name VARCHAR(100),
    client_phone VARCHAR(20) NOT NULL,
    device_brand VARCHAR(50),
    device_model VARCHAR(100),
    service_name VARCHAR(200),
    service_price INTEGER,
    comment TEXT,
    status VARCHAR(30) DEFAULT 'received',
    bonus_earned INTEGER DEFAULT 0,
    bonus_used INTEGER DEFAULT 0,
    source VARCHAR(30) DEFAULT 'calculator',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Bonus transactions table
CREATE TABLE t_p35950310_project_zenith_2127.bonus_transactions (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES t_p35950310_project_zenith_2127.clients(id),
    order_id INTEGER REFERENCES t_p35950310_project_zenith_2127.repair_orders(id),
    type VARCHAR(20) NOT NULL,
    amount INTEGER NOT NULL,
    description VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Shop orders table
CREATE TABLE t_p35950310_project_zenith_2127.shop_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(30) UNIQUE NOT NULL,
    client_id INTEGER REFERENCES t_p35950310_project_zenith_2127.clients(id),
    client_name VARCHAR(100) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    items JSONB NOT NULL,
    total_price INTEGER NOT NULL,
    bonus_used INTEGER DEFAULT 0,
    status VARCHAR(30) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table for auth
CREATE TABLE t_p35950310_project_zenith_2127.sessions (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES t_p35950310_project_zenith_2127.clients(id),
    token VARCHAR(128) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- SMS codes for phone auth
CREATE TABLE t_p35950310_project_zenith_2127.sms_codes (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Products table for shop (persistent storage)
CREATE TABLE t_p35950310_project_zenith_2127.products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(50),
    category VARCHAR(50),
    price INTEGER NOT NULL,
    original_price INTEGER,
    storage VARCHAR(20),
    color VARCHAR(50),
    has_nfc BOOLEAN DEFAULT FALSE,
    badge VARCHAR(30),
    description TEXT,
    image_url TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);