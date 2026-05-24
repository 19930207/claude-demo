-- 电商网站数据库设计
-- 数据库名称: shop_db
-- 字符集: utf8mb4

CREATE DATABASE IF NOT EXISTS shop_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shop_db;

-- 1. 用户表
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密）',
    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(255) COMMENT '头像URL',
    gender TINYINT DEFAULT 0 COMMENT '性别：0-未知，1-男，2-女',
    birthday DATE COMMENT '生日',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    role TINYINT DEFAULT 1 COMMENT '角色：1-普通用户，2-管理员',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除'
) COMMENT '用户表';

-- 2. 收货地址表
CREATE TABLE addresses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '地址ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    receiver_name VARCHAR(50) NOT NULL COMMENT '收货人姓名',
    receiver_phone VARCHAR(20) NOT NULL COMMENT '收货人电话',
    province VARCHAR(50) NOT NULL COMMENT '省份',
    city VARCHAR(50) NOT NULL COMMENT '城市',
    district VARCHAR(50) NOT NULL COMMENT '区县',
    detail_address VARCHAR(255) NOT NULL COMMENT '详细地址',
    postal_code VARCHAR(10) COMMENT '邮政编码',
    is_default TINYINT DEFAULT 0 COMMENT '是否默认地址：0-否，1-是',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
    INDEX idx_user_id (user_id)
) COMMENT '收货地址表';

-- 3. 商品分类表
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    parent_id BIGINT DEFAULT 0 COMMENT '父分类ID，0表示顶级分类',
    level TINYINT DEFAULT 1 COMMENT '分类层级',
    sort_order INT DEFAULT 0 COMMENT '排序',
    icon VARCHAR(255) COMMENT '分类图标',
    description VARCHAR(255) COMMENT '分类描述',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
    INDEX idx_parent_id (parent_id)
) COMMENT '商品分类表';

-- 4. 商品表
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '商品ID',
    name VARCHAR(200) NOT NULL COMMENT '商品名称',
    category_id BIGINT NOT NULL COMMENT '分类ID',
    brand VARCHAR(100) COMMENT '品牌',
    model VARCHAR(100) COMMENT '型号',
    price DECIMAL(10,2) NOT NULL COMMENT '价格',
    original_price DECIMAL(10,2) COMMENT '原价',
    cost_price DECIMAL(10,2) COMMENT '成本价',
    stock INT DEFAULT 0 COMMENT '库存数量',
    sales INT DEFAULT 0 COMMENT '销量',
    main_image VARCHAR(255) COMMENT '主图片',
    images TEXT COMMENT '图片列表，JSON格式',
    description TEXT COMMENT '商品描述',
    specifications TEXT COMMENT '商品规格，JSON格式',
    status TINYINT DEFAULT 1 COMMENT '状态：0-下架，1-上架',
    is_recommend TINYINT DEFAULT 0 COMMENT '是否推荐：0-否，1-是',
    is_hot TINYINT DEFAULT 0 COMMENT '是否热门：0-否，1-是',
    sort_order INT DEFAULT 0 COMMENT '排序',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_price (price),
    INDEX idx_sales (sales)
) COMMENT '商品表';

-- 5. 购物车表
CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '购物车项ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
    selected TINYINT DEFAULT 1 COMMENT '是否选中：0-否，1-是',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_user_product (user_id, product_id),
    INDEX idx_user_id (user_id)
) COMMENT '购物车表';

-- 6. 订单表
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
    order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
    payment_amount DECIMAL(10,2) NOT NULL COMMENT '实付金额',
    freight_amount DECIMAL(10,2) DEFAULT 0 COMMENT '运费',
    discount_amount DECIMAL(10,2) DEFAULT 0 COMMENT '优惠金额',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '订单状态：1-待支付，2-已支付，3-已发货，4-已完成，5-已取消',
    payment_type TINYINT COMMENT '支付方式：1-支付宝，2-微信支付',
    payment_time DATETIME COMMENT '支付时间',
    delivery_time DATETIME COMMENT '发货时间',
    receive_time DATETIME COMMENT '收货时间',
    receiver_name VARCHAR(50) NOT NULL COMMENT '收货人姓名',
    receiver_phone VARCHAR(20) NOT NULL COMMENT '收货人电话',
    receiver_address VARCHAR(500) NOT NULL COMMENT '收货地址',
    remark VARCHAR(500) COMMENT '订单备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_order_no (order_no),
    INDEX idx_status (status),
    INDEX idx_create_time (create_time)
) COMMENT '订单表';

-- 7. 订单详情表
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '订单项ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    product_name VARCHAR(200) NOT NULL COMMENT '商品名称',
    product_image VARCHAR(255) COMMENT '商品图片',
    price DECIMAL(10,2) NOT NULL COMMENT '商品价格',
    quantity INT NOT NULL COMMENT '购买数量',
    total_price DECIMAL(10,2) NOT NULL COMMENT '小计',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) COMMENT '订单详情表';

-- 8. 支付记录表
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '支付记录ID',
    order_id BIGINT NOT NULL COMMENT '订单ID',
    payment_no VARCHAR(50) NOT NULL UNIQUE COMMENT '支付流水号',
    payment_type TINYINT NOT NULL COMMENT '支付方式：1-支付宝，2-微信支付',
    payment_amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
    payment_status TINYINT DEFAULT 1 COMMENT '支付状态：1-待支付，2-支付成功，3-支付失败',
    third_party_no VARCHAR(100) COMMENT '第三方支付流水号',
    payment_time DATETIME COMMENT '支付完成时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_order_id (order_id),
    INDEX idx_payment_no (payment_no)
) COMMENT '支付记录表';

-- 添加外键约束
ALTER TABLE addresses ADD CONSTRAINT fk_addresses_user_id FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE products ADD CONSTRAINT fk_products_category_id FOREIGN KEY (category_id) REFERENCES categories(id);
ALTER TABLE cart_items ADD CONSTRAINT fk_cart_user_id FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE cart_items ADD CONSTRAINT fk_cart_product_id FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE orders ADD CONSTRAINT fk_orders_user_id FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_order_id FOREIGN KEY (order_id) REFERENCES orders(id);
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product_id FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE payments ADD CONSTRAINT fk_payments_order_id FOREIGN KEY (order_id) REFERENCES orders(id);

-- 插入测试数据
-- 1. 商品分类数据
INSERT INTO categories (name, parent_id, level, sort_order, description) VALUES
('电子产品', 0, 1, 1, '各类电子产品'),
('服装鞋帽', 0, 1, 2, '服装鞋帽类商品'),
('家居生活', 0, 1, 3, '家居生活用品'),
('手机数码', 1, 2, 1, '手机及数码产品'),
('电脑办公', 1, 2, 2, '电脑及办公设备'),
('男装', 2, 2, 1, '男性服装'),
('女装', 2, 2, 2, '女性服装'),
('家具', 3, 2, 1, '各类家具'),
('家电', 3, 2, 2, '家用电器');

-- 2. 管理员用户
INSERT INTO users (username, password, email, nickname, role) VALUES
('admin', '$2a$10$7JB720yubVSQLVwvTQg0c.YtQn4UYbS8VtoGvOSFQN/2QJ7BpPv7O', 'admin@shop.com', '系统管理员', 2);

-- 3. 示例商品数据
INSERT INTO products (name, category_id, brand, price, original_price, stock, main_image, description, status) VALUES
('iPhone 15 Pro', 4, 'Apple', 7999.00, 8999.00, 50, '/images/iphone15pro.jpg', '苹果最新旗舰手机', 1),
('华为Mate 60 Pro', 4, '华为', 6999.00, 7499.00, 30, '/images/mate60pro.jpg', '华为旗舰手机', 1),
('MacBook Pro 14', 5, 'Apple', 14999.00, 15999.00, 20, '/images/macbookpro14.jpg', '苹果专业笔记本电脑', 1),
('联想ThinkPad X1', 5, '联想', 12999.00, 13999.00, 25, '/images/thinkpadx1.jpg', '商务笔记本电脑', 1),
('男士休闲T恤', 6, '优衣库', 99.00, 129.00, 100, '/images/mens-tshirt.jpg', '舒适休闲T恤', 1),
('女士连衣裙', 7, 'ZARA', 299.00, 399.00, 80, '/images/womens-dress.jpg', '时尚连衣裙', 1);