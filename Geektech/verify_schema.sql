-- 1. Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio_base DECIMAL(10, 2) NOT NULL,
  imagen TEXT,
  opciones JSONB,
  categoria VARCHAR(50)
);

-- 2. Add columns if they are missing (Idempotent operations)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='productos' AND column_name='opciones') THEN
        ALTER TABLE productos ADD COLUMN opciones JSONB;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='productos' AND column_name='categoria') THEN
        ALTER TABLE productos ADD COLUMN categoria VARCHAR(50);
    END IF;
END $$;

-- 3. Verify content (Optional: update Categories if NULL)
UPDATE productos SET categoria = 'software' WHERE categoria IS NULL;

-- 4. Check the structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'productos';
