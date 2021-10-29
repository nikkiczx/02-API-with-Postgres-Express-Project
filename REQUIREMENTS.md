# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index                         GET     '/products'
- Show                          GET     '/products/:id'
- Create [token required]       POST    '/products'



#### Users
- Index [token required]        GET     '/users'
- Show [token required]         GET     '/users/:id'
- Create [token required]       POST    '/users'

#### Orders
- Index                         GET     '/orders'
- Show                          GET     '/orders/:userID'
- Create                        POST    '/orders/:userID'                
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
-  id
- name
- price

Table: Products(id: SERIAL PRIMARY KEY, name: VARCHAR, price: NUMERIC)

#### User
- id
- firstName
- lastName
- password

Table: Users(id: SERIAL PRIMARY KEY, firstName: VARCHAR, lastName: VARCHAR, password: VARCHAR)

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

Table: Orders(id: SERIAL PRIMARY KEY, product_id: INTEGER[FOREIGN KEY to Products table], quantity: INTEGER, user_id: INTEGER[FOREIGN KEY to Users table], status: VARCHAR)