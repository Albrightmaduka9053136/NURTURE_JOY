CREATE TABLE conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    emotion VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);