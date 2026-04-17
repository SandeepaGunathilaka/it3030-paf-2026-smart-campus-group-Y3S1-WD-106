-- ── Update ticket_attachments: rename file_path to file_url for Cloudinary ────
ALTER TABLE ticket_attachments 
CHANGE COLUMN file_path file_url VARCHAR(500) NOT NULL;