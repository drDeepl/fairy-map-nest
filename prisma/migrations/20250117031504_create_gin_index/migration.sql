-- This is an empty migration.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX trgm_idx ON stories USING gin (name gin_trgm_ops);

