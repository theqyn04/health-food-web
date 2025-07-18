-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS gout_diet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sử dụng database
USE gout_diet_db;

-- 1. Tạo bảng users
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    activity_level ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'),
    gout_severity ENUM('mild', 'moderate', 'severe'),
    medication VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tạo bảng user_health_metrics
CREATE TABLE user_health_metrics (
    metric_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    uric_acid_level DECIMAL(4,2) COMMENT 'mg/dL',
    measurement_date DATE NOT NULL,
    systolic_bp INT,
    diastolic_bp INT,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX (user_id, measurement_date)
) ENGINE=InnoDB;

-- 3. Tạo bảng food_items
CREATE TABLE food_items (
    food_id INT PRIMARY KEY AUTO_INCREMENT,
    food_name VARCHAR(100) NOT NULL,
    description TEXT,
    serving_size VARCHAR(50) NOT NULL,
    calories DECIMAL(7,2),
    protein_g DECIMAL(7,2),
    fat_g DECIMAL(7,2),
    carbs_g DECIMAL(7,2),
    purine_mg DECIMAL(7,2) NOT NULL COMMENT 'Purine content per serving in mg',
    purine_level ENUM('low', 'medium', 'high') NOT NULL,
    glycemic_index INT,
    is_approved BOOLEAN DEFAULT FALSE,
    added_by INT COMMENT 'User who suggested this food',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (added_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Tạo bảng food_categories
CREATE TABLE food_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL,
    description TEXT,
    gout_recommendation ENUM('avoid', 'limit', 'preferred') NOT NULL
) ENGINE=InnoDB;

-- 5. Tạo bảng food_category_mapping
CREATE TABLE food_category_mapping (
    food_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (food_id, category_id),
    FOREIGN KEY (food_id) REFERENCES food_items(food_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES food_categories(category_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Tạo bảng user_meals
CREATE TABLE user_meals (
    meal_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    meal_date DATE NOT NULL,
    meal_time TIME,
    notes TEXT,
    total_purines DECIMAL(7,2) COMMENT 'Calculated total purines in mg',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX (user_id, meal_date)
) ENGINE=InnoDB;

-- 7. Tạo bảng meal_items
CREATE TABLE meal_items (
    meal_item_id INT PRIMARY KEY AUTO_INCREMENT,
    meal_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity DECIMAL(5,2) NOT NULL COMMENT 'Number of servings',
    custom_serving_size VARCHAR(50),
    notes TEXT,
    FOREIGN KEY (meal_id) REFERENCES user_meals(meal_id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES food_items(food_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Tạo bảng gout_flareups
CREATE TABLE gout_flareups (
    flareup_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    severity ENUM('mild', 'moderate', 'severe') NOT NULL,
    affected_joints VARCHAR(255) NOT NULL,
    triggers TEXT COMMENT 'Potential triggers identified by user',
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX (user_id, start_date)
) ENGINE=InnoDB;

-- 9. Tạo bảng water_intake
CREATE TABLE water_intake (
    intake_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    intake_date DATE NOT NULL,
    amount_ml INT NOT NULL COMMENT 'Amount in milliliters',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX (user_id, intake_date)
) ENGINE=InnoDB;

-- 10. Tạo bảng user_goals
CREATE TABLE user_goals (
    goal_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    goal_type ENUM('daily_purine_limit', 'water_intake', 'weight_loss', 'uric_acid_level') NOT NULL,
    target_value DECIMAL(7,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX (user_id, is_active)
) ENGINE=InnoDB;

-- 11. Tạo bảng user_preferences
CREATE TABLE user_preferences (
    preference_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    preferred_cuisine VARCHAR(50),
    disliked_foods TEXT,
    allergies TEXT,
    dietary_restrictions TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. Tạo bảng recipes
CREATE TABLE recipes (
    recipe_id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_name VARCHAR(100) NOT NULL,
    description TEXT,
    instructions TEXT NOT NULL,
    preparation_time INT COMMENT 'In minutes',
    cooking_time INT COMMENT 'In minutes',
    servings INT,
    total_purines DECIMAL(7,2),
    purine_per_serving DECIMAL(7,2),
    is_gout_friendly BOOLEAN DEFAULT FALSE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 13. Tạo bảng recipe_ingredients
CREATE TABLE recipe_ingredients (
    recipe_ingredient_id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity DECIMAL(5,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    notes TEXT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES food_items(food_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. Tạo bảng user_saved_recipes
CREATE TABLE user_saved_recipes (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    notes TEXT,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Thêm một số dữ liệu mẫu
INSERT INTO food_categories (category_name, description, gout_recommendation) VALUES
('Thịt đỏ', 'Các loại thịt đỏ như thịt bò, thịt cừu', 'limit'),
('Hải sản', 'Các loại hải sản có vỏ như tôm, cua, sò', 'avoid'),
('Rau củ', 'Các loại rau củ ít purine', 'preferred'),
('Sản phẩm từ sữa', 'Sữa ít béo, phô mai, sữa chua', 'preferred'),
('Ngũ cốc nguyên hạt', 'Gạo lứt, yến mạch, lúa mì nguyên cám', 'preferred');

INSERT INTO food_items (food_name, serving_size, purine_mg, purine_level, description) VALUES
('Thịt bò', '100g', 110, 'high', 'Thịt bò nạc'),
('Tôm', '100g', 147, 'high', 'Tôm tươi'),
('Sữa tươi không đường', '200ml', 0, 'low', 'Sữa tươi ít béo'),
('Bông cải xanh', '100g', 21, 'low', 'Rau bông cải xanh tươi'),
('Yến mạch', '50g', 30, 'low', 'Yến mạch nguyên chất');