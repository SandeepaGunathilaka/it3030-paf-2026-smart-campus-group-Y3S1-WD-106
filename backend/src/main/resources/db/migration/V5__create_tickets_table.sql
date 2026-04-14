-- ── Tickets ───────────────────────────────────────────────────────────────────
CREATE TABLE tickets (
                         id                  BIGINT          NOT NULL AUTO_INCREMENT,
                         reporter_id         BIGINT          NOT NULL,
                         assigned_to_id      BIGINT,
                         resource_id         BIGINT,
                         title               VARCHAR(255)    NOT NULL,
                         description         TEXT            NOT NULL,
                         category            ENUM('ELECTRICAL','PLUMBING','IT_EQUIPMENT',
                             'FURNITURE','HVAC','OTHER') NOT NULL,
                         priority            ENUM('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL,
                         status              ENUM('OPEN','IN_PROGRESS','RESOLVED',
                             'CLOSED','REJECTED') NOT NULL DEFAULT 'OPEN',
                         location            VARCHAR(255)    NOT NULL,
                         contact_details     VARCHAR(255),
                         resolution_notes    TEXT,
                         rejection_reason    TEXT,
                         created_at          DATETIME(6),
                         updated_at          DATETIME(6),
                         PRIMARY KEY (id),
                         CONSTRAINT fk_ticket_reporter    FOREIGN KEY (reporter_id)    REFERENCES users (id),
                         CONSTRAINT fk_ticket_assigned_to FOREIGN KEY (assigned_to_id) REFERENCES users (id),
                         CONSTRAINT fk_ticket_resource    FOREIGN KEY (resource_id)    REFERENCES resources (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Ticket Attachments ────────────────────────────────────────────────────────
CREATE TABLE ticket_attachments (
                                    id          BIGINT          NOT NULL AUTO_INCREMENT,
                                    ticket_id   BIGINT          NOT NULL,
                                    file_name   VARCHAR(255)    NOT NULL,
                                    file_path   VARCHAR(500)    NOT NULL,
                                    file_type   VARCHAR(100),
                                    created_at  DATETIME(6),
                                    PRIMARY KEY (id),
                                    CONSTRAINT fk_attachment_ticket FOREIGN KEY (ticket_id) REFERENCES tickets (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Ticket Comments ───────────────────────────────────────────────────────────
CREATE TABLE ticket_comments (
                                 id          BIGINT          NOT NULL AUTO_INCREMENT,
                                 ticket_id   BIGINT          NOT NULL,
                                 author_id   BIGINT          NOT NULL,
                                 content     TEXT            NOT NULL,
                                 created_at  DATETIME(6),
                                 updated_at  DATETIME(6),
                                 PRIMARY KEY (id),
                                 CONSTRAINT fk_comment_ticket FOREIGN KEY (ticket_id) REFERENCES tickets (id),
                                 CONSTRAINT fk_comment_author FOREIGN KEY (author_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;