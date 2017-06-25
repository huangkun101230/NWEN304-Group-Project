# nwen304-project3-team-sweet
this holds an simple e-commerce website written in node + express + postgres

# api endpoints 
url endpoint | request type | description 
--- | --- | ---
/register | POST | registers a user by passing a json object which has the user information e.g {user: gygy, pass: jhfttf}
/login | POST | logins a user in by passing a json object in the body e.g {user: gygy, pass: jhfttf}
/logout | POST | logouts a user 
/user | GET | accesses the currently logged in user info in user table
/addtocart | PUT | adds a product to the users that is logged in by passing a json object in the body e.g {prodId: 1, amount 2}
/user/cart/:id | GET | gets info of a product in the users cart based of the product id e.g /user/cart/2 will get the product that has an product id of 2
/user/cart/amount/:id | POST | changes the amount of a certain product that is in the database based of the url parameter which will have the product id that you want to change 
user/cart/delete/:id | DELETE | deletes a product from the cart based of its product id 
/products | GET | gets all products in the products table 
/products/:id | GET | gets a product based off its id 



# database schema 

## users
holds the password and username of each user 

user_id SERIAL PRIMARY KEY NOT NULL | username TEXT | password TEXT NOT NULL
--- | --- | ---


## (user)_cart
hold all the items that are in the users cart 

id SERIAL  PRIMARY KEY NOT NULL | product_id BIGINT | amount  BIGINT
--- | --- | ---


## products 
holds info about all the products that are in the store 

| products_id SERIAL PRIMARY KEY NOT NULL | product_name TEXT NOT NULL | product_des TEXT NOT NULL | price TEXT | in_stock INTEGER | picture_dir TEXT | 
--- | --- | --- | --- | --- | --- |

