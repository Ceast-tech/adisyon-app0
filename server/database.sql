-- Veritabanını SIFIRDAN kuruyorsan Workbench'te çalıştır.
-- Zaten kurulu bir veritabanın varsa tekrar çalıştırma (örnek veriler ikiye katlanır).

CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS dining_tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_no INT NOT NULL UNIQUE,
  status ENUM('empty', 'occupied') DEFAULT 'empty'
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_id INT NOT NULL,
  status ENUM('open', 'closed') DEFAULT 'open',
  opened_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  closed_at DATETIME NULL,
  FOREIGN KEY (table_id) REFERENCES dining_tables(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(8,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO categories (name) VALUES ('Yiyecek'), ('İçecek');

INSERT INTO products (category_id, name, price) VALUES
(1, 'Mercimek Çorbası', 90.00),
(1, 'Izgara Köfte', 280.00),
(1, 'Tavuk Şiş', 250.00),
(2, 'Ayran', 30.00),
(2, 'Kola', 50.00),
(2, 'Çay', 20.00);

INSERT INTO dining_tables (table_no) VALUES (1), (2), (3), (4), (5);
