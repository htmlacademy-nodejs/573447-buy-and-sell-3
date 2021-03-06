DROP TABLE IF EXISTS offers_categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS offer_types;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS comments;

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL,
  picture VARCHAR(50) NOT NULL
);

CREATE TABLE categories
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50)
);

CREATE TABLE offer_types
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE offers
(
  id SERIAL PRIMARY KEY,
  picture VARCHAR(100) NOT NULL,
  title VARCHAR(50) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  sum MONEY NOT NULL,
  created_date DATE NOT NULL,

  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  type_id INTEGER NOT NULL,
  FOREIGN KEY (type_id) REFERENCES offer_types (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE comments
(
  id SERIAL PRIMARY KEY,
  created_date DATE NOT NULL,
  text VARCHAR(1000) NOT NULL,

  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  offer_id INTEGER NOT NULL,
  FOREIGN KEY (offer_id) REFERENCES offers (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE offers_categories
(
  offer_id INTEGER NOT NULL,
  FOREIGN KEY (offer_id) REFERENCES offers (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  category_id INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT offers_categories_pk PRIMARY KEY (offer_id, category_id)
);
