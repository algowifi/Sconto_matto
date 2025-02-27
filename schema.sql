-- Tabella per gli utenti
CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' -- 'admin', 'user'
);

-- Tabella per le categorie di attività commerciali
CREATE TABLE Categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

-- Tabella per le attività commerciali
CREATE TABLE Businesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category_id INTEGER,
  user_id INTEGER, -- Utente che ha creato/gestisce l'attività
  FOREIGN KEY (category_id) REFERENCES Categories(id),
  FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Tabella per gli sconti/offerte
CREATE TABLE Discounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  discount_percentage REAL,
  start_date TEXT, -- Formato data ISO 8601 (YYYY-MM-DD)
  end_date TEXT,   -- Formato data ISO 8601 (YYYY-MM-DD)
  FOREIGN KEY (business_id) REFERENCES Businesses(id)
);

-- Potrebbe essere utile una tabella di join per gestire le relazioni molti-a-molti tra Businesses e Categories se una business può appartenere a più categorie
-- Esempio:
-- CREATE TABLE BusinessCategories (
--   business_id INTEGER,
--   category_id INTEGER,
--   PRIMARY KEY (business_id, category_id),
--   FOREIGN KEY (business_id) REFERENCES Businesses(id),
--   FOREIGN KEY (category_id) REFERENCES Categories(id)
-- );
