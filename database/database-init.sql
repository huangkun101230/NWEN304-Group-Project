CREATE TABLE users (user_id  SERIAL PRIMARY KEY NOT NULL, username  TEXT NOT NULL, password  TEXT NOT NULL, cart TEXT ARRAY );
CREATE TABLE user_cart (id SERIAL  PRIMARY KEY NOT NULL, user_id BIGINT , items TEXT ARRAY);
CREATE TABLE products (products_id  SERIAL PRIMARY KEY NOT NULL, product_name TEXT NOT NULL, product_des TEXT NOT NULL,price INTEGER,picture_dir TEXT);

