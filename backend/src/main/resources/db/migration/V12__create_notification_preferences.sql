CREATE TABLE notification_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE KEY uq_user_category (user_id, category),
    CONSTRAINT fk_notif_pref_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
