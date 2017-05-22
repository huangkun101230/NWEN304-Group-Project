CREATE TABLE users (user_id NOT NULL SERIAL PRIMARY KEY, username NOT NULL TEXT, password NOT NULL TEXT, cart TEXT ARRAY );
CREATE TABLE user_cart (id NOT NULL PRIMARY KEY,items TEXT ARRAY);
CREATE TABLE products (products_id NOT NULL SERIAL PRIMARY KEY, product_name NOT NULL TEXT, product_des NOT NULL TEXT,price INTEGER,picture_dir TEXT);