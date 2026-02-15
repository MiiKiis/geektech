-- 1. Home Table (Banner)
CREATE TABLE IF NOT EXISTS home (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255),
  imagen_url VARCHAR(500) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  link VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS home_game (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2),
  imagen_url VARCHAR(500),
  categoria VARCHAR(100),
  variantes_precio TEXT
);

-- 2. Tienda Table (General Store/Credits)
CREATE TABLE IF NOT EXISTS tienda (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2),
  imagen_url VARCHAR(500),
  categoria VARCHAR(100),
  variantes_precio VARCHAR(500)
);

-- 3. Windows Keys Table
CREATE TABLE IF NOT EXISTS windows_keys (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2),
  imagen_url VARCHAR(500),
  tipo VARCHAR(100), -- e.g., win10, win11, office
  version VARCHAR(100)
);

-- 4. Cuentas Streaming Table
CREATE TABLE IF NOT EXISTS cuentas_streaming (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2),
  imagen_url VARCHAR(500),
  duracion VARCHAR(100), -- e.g., 1 mes, 1 año
  plataforma VARCHAR(100)
);
