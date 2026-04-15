-- ── 1. Add account status column to users ────────────────────────────────────
ALTER TABLE users
    ADD COLUMN status ENUM('PENDING', 'ACTIVE', 'REJECTED') NOT NULL DEFAULT 'PENDING' AFTER role;

-- ── 2. Set all existing users to ACTIVE (they predate the approval flow) ──────
UPDATE users SET status = 'ACTIVE';

-- ── 3. Expand role enum to include SUPER_ADMIN ────────────────────────────────
ALTER TABLE users
    MODIFY COLUMN role ENUM('USER', 'TECHNICIAN', 'ADMIN', 'SUPER_ADMIN') NOT NULL;

-- ── 4. Promote seed super admin to SUPER_ADMIN role ──────────────────────────
UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'janeeshapaba@gmail.com';

-- ── 5. Expand notifications type enum to include account events ───────────────
ALTER TABLE notifications
    MODIFY COLUMN type ENUM(
        'BOOKING_APPROVED',
        'BOOKING_REJECTED',
        'BOOKING_CANCELLED',
        'TICKET_STATUS_CHANGED',
        'TICKET_COMMENT_ADDED',
        'TICKET_ASSIGNED',
        'ACCOUNT_APPROVED',
        'ACCOUNT_REJECTED'
    ) NOT NULL;
