-- ── Bookings ───────────────────────────────────────────────────────────────────
CREATE TABLE bookings (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    resource_id         BIGINT          NOT NULL,
    user_id             BIGINT          NOT NULL,
    start_time          DATETIME(6)     NOT NULL,
    end_time            DATETIME(6)     NOT NULL,
    purpose             VARCHAR(500)    NOT NULL,
    expected_attendees  INT,
    status              ENUM('PENDING','APPROVED','REJECTED','CANCELLED') NOT NULL DEFAULT 'PENDING',
    admin_note          VARCHAR(500),
    created_at          DATETIME(6),
    updated_at          DATETIME(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_booking_resource FOREIGN KEY (resource_id) REFERENCES resources (id),
    CONSTRAINT fk_booking_user     FOREIGN KEY (user_id)     REFERENCES users (id),
    CONSTRAINT chk_booking_time    CHECK (end_time > start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Index for conflict-check query performance (the key query you'll write)
CREATE INDEX idx_booking_resource_time
    ON bookings (resource_id, start_time, end_time);

-- Index for "my bookings" user queries
CREATE INDEX idx_booking_user
    ON bookings (user_id);