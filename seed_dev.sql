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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on Users table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON Users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Guest Table
CREATE TABLE Guests (
    guest_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    case_manager VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to update updated_at on Guests table
CREATE TRIGGER update_guests_updated_at
BEFORE UPDATE ON Guests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Guest Notifications Table
CREATE TABLE GuestNotifications (
    notification_id SERIAL PRIMARY KEY,
    guest_id INT NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES Guests(guest_id) ON DELETE CASCADE
);

-- Trigger to update updated_at on GuestNotifications table
CREATE TRIGGER update_guest_notifications_updated_at
BEFORE UPDATE ON GuestNotifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Service Table
CREATE TABLE Services (
    service_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quota INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to update updated_at on Services table
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON Services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Visits Table
CREATE TABLE Visits (
    visit_id SERIAL PRIMARY KEY,
    guest_id INT NOT NULL,
    service_ids JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES Guests(guest_id) ON DELETE CASCADE
);

-- Trigger to update updated_at on Visits table
CREATE TRIGGER update_visits_updated_at
BEFORE UPDATE ON Visits
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Guest Services Table (Tracks Service Status)
CREATE TABLE GuestServices (
    guest_service_id SERIAL PRIMARY KEY,
    guest_id INT NOT NULL,
    service_id INT NOT NULL,
    slot_id INT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Queued', 'Slotted', 'Completed')),
    queued_at TIMESTAMP,
    slotted_at TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES Guests(guest_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE CASCADE
);

-- Indexes for GuestServices table
CREATE INDEX fk_guest_id ON GuestServices (guest_id);
CREATE INDEX fk_service_id ON GuestServices (service_id);

INSERT INTO users (user_id, email, password, role) VALUES
 (1, 'admin@apolis.dev', 'password', 'admin' ),
 (2, 'manager@apolis.dev', 'password', 'manager');

INSERT INTO services (service_id, name, quota) VALUES
 (1, 'Service 1', 10),
 (2, 'Service 2', 20),
 (3, 'Service 3', 30);