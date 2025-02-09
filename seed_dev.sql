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
CREATE TABLE Guest_Notifications (
    notification_id SERIAL PRIMARY KEY,
    guest_id INT NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES Guests(guest_id) ON DELETE CASCADE
);

-- Trigger to update updated_at on Guest_Notifications table
CREATE TRIGGER update_guest_notifications_updated_at
BEFORE UPDATE ON Guest_Notifications
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
CREATE TABLE Guest_Services (
    guest_service_id SERIAL PRIMARY KEY,
    guest_id INT NOT NULL,
    service_id INT NOT NULL,
    slot_id INT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Queued', 'Slotted', 'Completed')) DEFAULT 'Queued',
    queued_at TIMESTAMP,
    slotted_at TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES Guests(guest_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION set_timestamp_based_on_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the status column is being updated
    IF NEW.status <> OLD.status THEN
        -- Update the field based on the new status value
        IF NEW.status = 'Slotted' THEN
            NEW.slotted_at = CURRENT_TIMESTAMP;
        ELSIF NEW.status = 'Completed' THEN
            NEW.completed_at = CURRENT_TIMESTAMP;
        ELSIF NEW.status = 'QUEUED' THEN
            NEW.queued_at = CURRENT_TIMESTAMP;
        END IF;
    END IF;

    -- Return the modified row
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_timestamp_on_status_change
BEFORE UPDATE ON guest_services
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status) -- Only fire if status changes
EXECUTE FUNCTION set_timestamp_based_on_status();

-- Indexes for GuestServices table
CREATE INDEX fk_guest_id ON Guest_Services (guest_id);
CREATE INDEX fk_service_id ON Guest_Services (service_id);

INSERT INTO users (email, password, role) VALUES
 ('admin@apolis.dev', 'password', 'admin' ),
 ('manager@apolis.dev', 'password', 'manager');

INSERT INTO services (name, quota) VALUES
 ('Service 1', 10),
 ('Service 2', 20),
 ('Service 3', 30);

INSERT INTO guests (first_name, last_name, dob, case_manager) VALUES
 ('John', 'Doe', '1990-01-01', 'Case Manager 1'),
 ('Jane', 'Doe', '1995-01-01', 'Case Manager 2');

INSERT INTO guest_services (guest_id, service_id, status) VALUES
 (1, 1, 'Queued'),
 (1, 2, 'Slotted'),
 (2, 3, 'Completed');