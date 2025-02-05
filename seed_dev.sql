\c mydatabase
-- User Table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('manager', 'admin')),
    sub VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (user_id, email, password, role) VALUES
 (1, 'admin@apolis.dev', 'password', 'admin' ),
 (2, 'manager@apolis.dev', 'password', 'manager');
