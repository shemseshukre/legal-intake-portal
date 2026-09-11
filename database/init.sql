CREATE DATABASE IF NOT EXISTS legal_intake;

USE legal_intake;

CREATE TABLE IF NOT EXISTS legal_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_title VARCHAR(255) NOT NULL,
    business_unit VARCHAR(255) NOT NULL,
    counterparty VARCHAR(255) NOT NULL,
    contract_type VARCHAR(255) NOT NULL,
    contract_value VARCHAR(255) NOT NULL,
    required_by_date DATE NOT NULL,
    personal_data_involved VARCHAR(50) NOT NULL,
    customer_type VARCHAR(100) NOT NULL,
    risk_level VARCHAR(100) NOT NULL,
    priority VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'submitted',

    file_original_name VARCHAR(255) NULL,
    file_stored_name VARCHAR(255) NULL,
    file_path VARCHAR(500) NULL,
    file_mime_type VARCHAR(100) NULL,
    file_size BIGINT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);