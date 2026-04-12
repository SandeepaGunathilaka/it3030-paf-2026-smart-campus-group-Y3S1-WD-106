-- ── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    google_id   VARCHAR(255)    UNIQUE,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    name        VARCHAR(255)    NOT NULL,
    picture_url VARCHAR(500),
    role        ENUM('USER','TECHNICIAN','ADMIN') NOT NULL,
    created_at  DATETIME(6),
    updated_at  DATETIME(6),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- ── Notifications ─────────────────────────────────────────────────────────────
CREATE TABLE notifications (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    recipient_id    BIGINT          NOT NULL,
    type            ENUM('BOOKING_APPROVED','BOOKING_REJECTED','BOOKING_CANCELLED',
                         'TICKET_STATUS_CHANGED','TICKET_COMMENT_ADDED','TICKET_ASSIGNED') NOT NULL,
    title           VARCHAR(255)    NOT NULL,
    message         TEXT            NOT NULL,
    is_read         TINYINT(1)      NOT NULL DEFAULT 0,
    reference_id    BIGINT,
    reference_type  VARCHAR(100),
    created_at      DATETIME(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_notification_recipient FOREIGN KEY (recipient_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
