-- Rental Management System - Database Setup
-- Run this script to create the database

CREATE DATABASE IF NOT EXISTS rental_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rental_db;

-- The tables will be auto-created by Hibernate (spring.jpa.hibernate.ddl-auto=update)
-- This script adds initial seed data

-- Insert default admin user (password: admin123)
-- BCrypt hash of "admin123"
INSERT IGNORE INTO users (username, password, email, full_name, phone, role, created_at)
VALUES (
    'admin',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi',
    'admin@rentpro.com',
    'System Administrator',
    '+1-555-0100',
    'ADMIN',
    NOW()
);

-- Insert sample manager
INSERT IGNORE INTO users (username, password, email, full_name, phone, role, created_at)
VALUES (
    'manager',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi',
    'manager@rentpro.com',
    'Property Manager',
    '+1-555-0101',
    'MANAGER',
    NOW()
);

-- Insert sample tenant
INSERT IGNORE INTO users (username, password, email, full_name, phone, role, created_at)
VALUES (
    'tenant1',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi',
    'tenant1@example.com',
    'John Tenant',
    '+1-555-0200',
    'TENANT',
    NOW()
);

-- Default credentials:
-- admin / admin123
-- manager / admin123
-- tenant1 / admin123
