-- Fix all FK constraints that reference users(id) so that deleting a user
-- automatically cleans up their related rows instead of throwing a constraint error.

-- ── notifications ─────────────────────────────────────────────────────────────
ALTER TABLE notifications DROP FOREIGN KEY fk_notification_recipient;
ALTER TABLE notifications ADD CONSTRAINT fk_notification_recipient
    FOREIGN KEY (recipient_id) REFERENCES users (id) ON DELETE CASCADE;

-- ── bookings ──────────────────────────────────────────────────────────────────
ALTER TABLE bookings DROP FOREIGN KEY fk_booking_user;
ALTER TABLE bookings ADD CONSTRAINT fk_booking_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- ── tickets (reporter) ────────────────────────────────────────────────────────
ALTER TABLE tickets DROP FOREIGN KEY fk_ticket_reporter;
ALTER TABLE tickets ADD CONSTRAINT fk_ticket_reporter
    FOREIGN KEY (reporter_id) REFERENCES users (id) ON DELETE CASCADE;

-- ── tickets (assigned technician) — set null so the ticket is not lost ────────
ALTER TABLE tickets DROP FOREIGN KEY fk_ticket_assigned_to;
ALTER TABLE tickets ADD CONSTRAINT fk_ticket_assigned_to
    FOREIGN KEY (assigned_to_id) REFERENCES users (id) ON DELETE SET NULL;

-- ── ticket_comments (author) ─────────────────────────────────────────────────
ALTER TABLE ticket_comments DROP FOREIGN KEY fk_comment_author;
ALTER TABLE ticket_comments ADD CONSTRAINT fk_comment_author
    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE;
