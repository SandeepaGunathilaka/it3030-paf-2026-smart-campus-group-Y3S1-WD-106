-- ── Resources ──────────────────────────────────────────────────────────────────
CREATE TABLE resources (
    id                   BIGINT          NOT NULL AUTO_INCREMENT,
    name                 VARCHAR(255)    NOT NULL,
    type                 ENUM('LECTURE_HALL','LAB','MEETING_ROOM','EQUIPMENT') NOT NULL,
    capacity             INT             NOT NULL,
    location             VARCHAR(255)    NOT NULL,
    availability_windows TEXT,
    status               ENUM('ACTIVE','OUT_OF_SERVICE') NOT NULL,
    created_at           DATETIME(6),
    updated_at           DATETIME(6),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;