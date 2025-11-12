-- Xóa bảng nếu tồn tại
DROP TABLE IF EXISTS user_role CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Bảng vai trò
CREATE TABLE roles (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(50) NOT NULL UNIQUE
);

-- Bảng người dùng
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       first_name VARCHAR(255),
                       last_name VARCHAR(255),
                       username VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL
);

-- Liên kết người dùng & vai trò
CREATE TABLE user_role (
                           user_id BIGINT NOT NULL,
                           role_id BIGINT NOT NULL,
                           PRIMARY KEY (user_id, role_id),
                           FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                           FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Bảng danh mục
CREATE TABLE categories (
                            id BIGSERIAL PRIMARY KEY,
                            name VARCHAR(255) NOT NULL UNIQUE
);

-- Bảng sản phẩm
CREATE TABLE products (
                          id BIGSERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          price DECIMAL(10,2) NOT NULL,
                          quantity INT NOT NULL DEFAULT 0,
                          description TEXT,
                          category_id BIGINT NOT NULL,
                          CONSTRAINT FK_PRODUCT_CATEGORY FOREIGN KEY (category_id)
                              REFERENCES categories(id)
                              ON DELETE RESTRICT
                              ON UPDATE CASCADE
);

-- Thêm dữ liệu mặc định
INSERT INTO roles (name) VALUES
                             ('USER'),
                             ('ADMIN');

INSERT INTO categories (name)
VALUES
    ('Electronics'),
    ('Home & Kitchen'),
    ('Fashion'),
    ('Home Appliances'),
    ('Books'),
    ('Office'),
    ('Furniture'),
    ('Accessories'),
    ('Toys');

INSERT INTO products (name, price, quantity, description, category_id) VALUES
                                                                           ('Laptop Acer Aspire 7', 18990000, 25, 'Laptop gaming hiệu năng cao với chip Intel Gen 12.', 1),
                                                                           ('Bàn phím cơ DareU EK87', 890000, 50, 'Bàn phím cơ với switch Blue RGB backlight.', 1),
                                                                           ('Chuột Logitech G102', 450000, 75, 'Chuột chơi game có đèn LED RGB và độ chính xác cao.', 1),
                                                                           ('Tai nghe Sony WH-1000XM5', 7490000, 15, 'Tai nghe chống ồn cao cấp, pin 30 giờ.', 1),
                                                                           ('Bình giữ nhiệt Lock&Lock 500ml', 350000, 90, 'Giữ nóng 12 giờ và lạnh 24 giờ, vỏ thép không gỉ.', 2),
                                                                           ('Áo thun Uniqlo cổ tròn', 290000, 120, 'Áo cotton thoáng mát, phù hợp mặc hằng ngày.', 3),
                                                                           ('Quạt đứng Panasonic F-409K', 1350000, 40, 'Quạt đứng 5 cánh, công suất 60W, điều khiển từ xa.', 4),
                                                                           ('Bếp điện từ Sunhouse SHD6862', 890000, 60, 'Bếp điện từ cảm ứng công suất 2000W.', 4),
                                                                           ('Sách Clean Code', 320000, 30, 'Cuốn sách nổi tiếng về cách viết mã sạch của Robert C. Martin.', 5),
                                                                           ('Giày thể thao Nike Air Max', 2750000, 20, 'Giày sneaker chính hãng, đệm khí êm ái.', 3),
                                                                           ('Tủ lạnh Samsung Inverter 256L', 8290000, 10, 'Tủ lạnh tiết kiệm điện với công nghệ làm lạnh đa chiều.', 4),
                                                                           ('Ghế công thái học Sihoo M57', 4990000, 35, 'Ghế văn phòng hỗ trợ lưng, điều chỉnh độ cao linh hoạt.', 6),
                                                                           ('Điện thoại iPhone 15 Pro', 27990000, 12, 'Smartphone cao cấp với chip A17 Pro và camera 48MP.', 1),
                                                                           ('Bàn học gỗ thông', 1650000, 22, 'Bàn học chất liệu gỗ thông tự nhiên, phủ sơn bóng.', 7),
                                                                           ('Balo chống nước Targus 15.6 inch', 890000, 70, 'Balo laptop chống nước, nhiều ngăn tiện lợi.', 8),
                                                                           ('Đèn bàn học LED Rạng Đông', 320000, 55, 'Đèn LED tiết kiệm điện, 3 chế độ sáng.', 2),
                                                                           ('Cốc sứ Minh Long', 120000, 120, 'Cốc sứ cao cấp, thiết kế sang trọng.', 2),
                                                                           ('Bộ đồ chơi LEGO City', 1450000, 18, 'Bộ LEGO phát triển tư duy sáng tạo cho trẻ.', 9),
                                                                           ('Máy in Canon LBP2900', 3650000, 15, 'Máy in laser đơn năng, in nhanh 12 trang/phút.', 6),
                                                                           ('Máy lọc không khí Sharp FP-J40E-W', 4500000, 10, 'Máy lọc không khí có ion âm, lọc sạch bụi mịn PM2.5.', 4);
