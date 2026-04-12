-- ── Users ────────────────────────────────────────────────────────────────────
-- Passwords are not stored (OAuth2 only); google_id left null for seed users
INSERT INTO users (id, email, name, picture_url, role, created_at, updated_at) VALUES
(1, 'janeeshapaba@gmail.com',  'Janeesha',   NULL, 'ADMIN',       NOW(), NOW());
