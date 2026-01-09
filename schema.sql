DROP TABLE IF EXISTS meter_readings;
DROP TABLE IF EXISTS meter_reader_assignments;
DROP TABLE IF EXISTS meter_customer_assignments;
DROP TABLE IF EXISTS tariff_slabs;
DROP TABLE IF EXISTS tariffs;
DROP TABLE IF EXISTS bills;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS meters;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'ADMIN_STAFF', 'MANAGER', 'METER_READER', 'CUSTOMER', 'CASHIER') NOT NULL,
    phone VARCHAR(20),
    nic VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    nic VARCHAR(50),
    address TEXT,
    customer_type ENUM('HOUSEHOLD', 'BUSINESS', 'GOVERNMENT') DEFAULT 'HOUSEHOLD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_customer_type (customer_type)
);

CREATE TABLE meters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meter_number VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'FAULTY') DEFAULT 'ACTIVE',
    utility_type ENUM('ELECTRICITY', 'WATER', 'GAS') NOT NULL,
    unit VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_meter_number (meter_number),
    INDEX idx_status (status),
    INDEX idx_utility_type (utility_type)
);

CREATE TABLE meter_customer_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meter_id INT NOT NULL,
    customer_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unassigned_at TIMESTAMP NULL,
    FOREIGN KEY (meter_id) REFERENCES meters(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_meter_id (meter_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_unassigned_at (unassigned_at)
);

CREATE TABLE tariffs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    utility_type ENUM('ELECTRICITY', 'WATER', 'GAS') NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_utility_type (utility_type),
    INDEX idx_status (status)
);

CREATE TABLE tariff_slabs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tariff_id INT NOT NULL,
    min_units DECIMAL(10, 2) NOT NULL,
    max_units DECIMAL(10, 2),
    rate_per_unit DECIMAL(10, 4) NOT NULL,
    fixed_charge DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (tariff_id) REFERENCES tariffs(id) ON DELETE CASCADE,
    INDEX idx_tariff_id (tariff_id)
);

CREATE TABLE meter_reader_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meter_id INT NOT NULL,
    meter_reader_id INT NOT NULL,
    period VARCHAR(7) NOT NULL COMMENT 'YYYY-MM format',
    status ENUM('PENDING', 'COMPLETED', 'SKIPPED') DEFAULT 'PENDING',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (meter_id) REFERENCES meters(id) ON DELETE CASCADE,
    FOREIGN KEY (meter_reader_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_meter_id (meter_id),
    INDEX idx_meter_reader_id (meter_reader_id),
    INDEX idx_period (period),
    INDEX idx_status (status),
    UNIQUE KEY unique_assignment (meter_id, meter_reader_id, period)
);

CREATE TABLE meter_readings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meter_id INT NOT NULL,
    reading_date DATE NOT NULL,
    previous_reading DECIMAL(10, 2) NOT NULL DEFAULT 0,
    current_reading DECIMAL(10, 2) NOT NULL,
    units_used DECIMAL(10, 2) NOT NULL,
    bill_amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meter_id) REFERENCES meters(id) ON DELETE CASCADE,
    INDEX idx_meter_id (meter_id),
    INDEX idx_reading_date (reading_date)
);

CREATE TABLE bills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meter_id INT NOT NULL,
    billing_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    outstanding_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'PARTIAL', 'PAID', 'OVERDUE') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (meter_id) REFERENCES meters(id) ON DELETE CASCADE,
    INDEX idx_meter_id (meter_id),
    INDEX idx_billing_date (billing_date),
    INDEX idx_status (status)
);

CREATE TABLE complaints (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    complaint_text TEXT NOT NULL,
    status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

INSERT INTO users (name, email, password, role) VALUES 
('System Administrator', 'admin@enerlytics.com', '$2b$10$uUQxKAm92Z3bqEEGPDQGSOBrfkkntZKQ0rxCEzrq3he/WsPVEm.Sm', 'ADMIN');
