-- 1. Crear la tabla 'productos'
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio_base DECIMAL(10, 2) NOT NULL,
  imagen VARCHAR(500),
  opciones JSONB -- Aquí guardaremos las variantes (pueden ser objetos complejos o arrays)
);

-- 2. Insertar un producto de ejemplo con opciones (Windows 10 Pro)
INSERT INTO productos (nombre, descripcion, precio_base, imagen, opciones)
VALUES (
  'Windows 10 Pro',
  'Licencia Digital Original para 1 PC',
  10.00,
  '/img/windows10.jpg',
  '[
    {"label": "Licencia OEM", "value": 10.00},
    {"label": "Licencia Retail", "value": 25.00},
    {"label": "Licencia Volumen (5 PCs)", "value": 45.00}
  ]'::jsonb
);

-- 3. Insertar otro producto de ejemplo (Hytale - Juego futuro) - Ejemplo de array simple si fuera necesario, pero mantenemos estructura consistente
INSERT INTO productos (nombre, descripcion, precio_base, imagen, opciones)
VALUES (
  'Hytale',
  'Juego de aventura RPG',
  30.00,
  '/img/hytale.jpg',
  '[
     {"label": "Standard Edition", "value": 30.00},
     {"label": "Collector Edition", "value": 50.00}
  ]'::jsonb
);
