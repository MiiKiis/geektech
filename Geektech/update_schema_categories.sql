-- 1. Add category column if it doesn't exist
ALTER TABLE productos ADD COLUMN IF NOT EXISTS categoria VARCHAR(50);

-- 2. Update existing products with categories based on simple rules or IDs
-- You might need to adjust these IDs based on your actual data

-- Default everything to 'software' first
UPDATE productos SET categoria = 'software';

-- Update 'Cuentas Streaming' (example logic, adjust IDs or names)
UPDATE productos SET categoria = 'streaming' WHERE nombre ILIKE '%Spotify%' OR nombre ILIKE '%Netflix%' OR nombre ILIKE '%YouTube%' OR nombre ILIKE '%Disney%' OR nombre ILIKE '%HBO%';

-- Update 'Juegos' (example)
UPDATE productos SET categoria = 'juegos' WHERE nombre ILIKE '%Steam%' OR nombre ILIKE '%Xbox%' OR nombre ILIKE '%PlayStation%' OR nombre ILIKE '%Nintendo%' OR nombre ILIKE '%Fornite%' OR nombre ILIKE '%Free Fire%';

-- Update 'Windows Keys'
UPDATE productos SET categoria = 'windows' WHERE nombre ILIKE '%Windows%' OR nombre ILIKE '%Office%';

-- 3. Verify
SELECT id, nombre, categoria FROM productos;
