CREATE TABLE users (user_id SERIAL PRIMARY KEY, username TEXT, password TEXT, cart TEXT ARRAY );
CREATE TABLE user_cart (cart_id SERIAL PRIMARY KEY,user_id INTEGER,items TEXT ARRAY);
CREATE TABLE products (products_id cart_id SERIAL PRIMARY KEY, product_name TEXT, product_des TEXT,price INTEGER,picture_dir TEXT);