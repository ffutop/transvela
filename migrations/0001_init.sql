CREATE TABLE links (
  short_code TEXT PRIMARY KEY,
  ciphertext TEXT NOT NULL,
  hint TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER,
  max_views INTEGER,
  view_count INTEGER DEFAULT 0
);
