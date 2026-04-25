CREATE TABLE t_p35950310_project_zenith_2127.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(72) NOT NULL,
    name VARCHAR(255),
    email_verified BOOLEAN DEFAULT TRUE,
    failed_login_attempts INTEGER DEFAULT 0,
    last_failed_login_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE t_p35950310_project_zenith_2127.refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p35950310_project_zenith_2127.users(id),
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE t_p35950310_project_zenith_2127.password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p35950310_project_zenith_2127.users(id),
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE t_p35950310_project_zenith_2127.email_verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p35950310_project_zenith_2127.users(id),
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON t_p35950310_project_zenith_2127.users(email);
CREATE INDEX idx_refresh_tokens_hash ON t_p35950310_project_zenith_2127.refresh_tokens(token_hash);
CREATE INDEX idx_password_reset_tokens_hash ON t_p35950310_project_zenith_2127.password_reset_tokens(token_hash);
CREATE INDEX idx_email_verification_tokens_hash ON t_p35950310_project_zenith_2127.email_verification_tokens(token_hash);