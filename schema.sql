
-- Tabella per gli utenti
CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user', -- 'admin', 'user'
  plan TEXT DEFAULT 'Basic', -- 'Basic', 'Medium', 'Premium'
  isActive BOOLEAN DEFAULT 1,
  registeredDate TEXT DEFAULT (datetime('now')) -- Formato data ISO 8601
);

-- Tabella per le categorie di attività commerciali
CREATE TABLE Categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  icon TEXT DEFAULT 'Store'
);

-- Tabella per le attività commerciali
CREATE TABLE Businesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  discount INTEGER NOT NULL,
  category_id INTEGER,
  image TEXT DEFAULT '/placeholder.svg',
  latitude REAL,
  longitude REAL,
  FOREIGN KEY (category_id) REFERENCES Categories(id)
);

-- Tabella per gli sconti/offerte selezionate dagli utenti
CREATE TABLE UserSelectedBusinesses (
  user_id INTEGER,
  business_id INTEGER,
  selected_date TEXT DEFAULT (datetime('now')), -- Formato data ISO 8601
  PRIMARY KEY (user_id, business_id),
  FOREIGN KEY (user_id) REFERENCES Users(id),
  FOREIGN KEY (business_id) REFERENCES Businesses(id)
);

-- Inserimenti iniziali per i dati di esempio
-- Utenti
INSERT INTO Users (username, email, password_hash, role, plan, isActive, registeredDate) 
VALUES 
('admin', 'admin@example.com', 'test1', 'admin', 'Premium', 1, '2023-08-01'),
('mario_rossi', 'mario@example.com', 'password', 'user', 'Medium', 1, '2023-08-15'),
('giulia_bianchi', 'giulia@example.com', 'password', 'user', 'Premium', 1, '2023-10-22'),
('roberto_verdi', 'roberto@example.com', 'password', 'user', 'Medium', 0, '2023-11-30');

-- Categorie
INSERT INTO Categories (name, icon) VALUES 
('Ristorante', 'UtensilsCrossed'),
('Benessere', 'Spa'),
('Fitness', 'Dumbbell'),
('Intrattenimento', 'Film'),
('Musei', 'Landmark'),
('Parchi', 'Leaf'),
('Scavi Archeologici', 'Landmark');

-- Attività commerciali
INSERT INTO Businesses (name, description, discount, category_id, image) VALUES
('Caffè Milano', 'Autentica cucina italiana nel cuore della città', 20, 1, '/placeholder.svg'),
('Beauty Center', 'Trattamenti spa e servizi di bellezza', 15, 2, '/placeholder.svg'),
('Sport Life', 'Palestra e corsi di fitness personalizzati', 25, 3, '/placeholder.svg'),
('Cinema Roma', 'Film in prima visione e eventi speciali', 30, 4, '/placeholder.svg'),
('Pizzeria Napoli', 'Pizza napoletana autentica con ingredienti di prima qualità', 15, 1, '/placeholder.svg'),
('Teatro Centrale', 'Spettacoli teatrali e performance dal vivo', 20, 4, '/placeholder.svg'),
('Yoga Studio', 'Lezioni di yoga per tutti i livelli', 30, 3, '/placeholder.svg'),
('Sushi Bar', 'Sushi fresco e cucina giapponese moderna', 25, 1, '/placeholder.svg'),
('Centro Massaggi', 'Massaggi rilassanti e terapeutici', 20, 2, '/placeholder.svg'),
('CrossFit Box', 'Allenamenti funzionali ad alta intensità', 20, 3, '/placeholder.svg'),
('Bowling Center', 'Piste da bowling e area giochi', 35, 4, '/placeholder.svg'),
('Gelateria Antica', 'Gelato artigianale con ingredienti naturali', 10, 1, '/placeholder.svg'),
('Spa Resort', 'Spa di lusso con piscina e sauna', 25, 2, '/placeholder.svg'),
('Dance Studio', 'Corsi di danza per adulti e bambini', 15, 3, '/placeholder.svg'),
('Escape Room', 'Giochi di fuga immersivi e coinvolgenti', 20, 4, '/placeholder.svg'),
('Museo del Mondo', 'Esposizioni di arte e storia', 20, 5, '/placeholder.svg'),
('Parco Nazionale del Vesuvio', 'Tradizione e storia', 20, 6, '/placeholder.svg'),
('Scavi di Pompei', 'Visita agli scavi archeologici di Pompei', 15, 7, '/placeholder.svg'),
('Scavi di Ercolano', 'Esplora gli scavi archeologici di Ercolano', 10, 7, '/placeholder.svg');
