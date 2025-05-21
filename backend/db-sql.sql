CREATE DATABASE social_media;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    profile_pic_url TEXT,
    date_of_birth DATE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts Table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    caption TEXT,
    shared_post_id INTEGER REFERENCES posts(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_self_reference CHECK (shared_post_id IS NULL OR shared_post_id <> id)
);

-- Reactions Table
CREATE TABLE reactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    reaction_type VARCHAR(10) NOT NULL CHECK (reaction_type IN ('like', 'haha', 'wow', 'cry', 'angry')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- Followers Table
CREATE TABLE followers (
    id SERIAL PRIMARY KEY,
    follower_id INT REFERENCES users(id) ON DELETE CASCADE,
    following_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);

-- Comments Table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stories Table
CREATE TABLE stories (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

-- Hashtags Table
CREATE TABLE hashtags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Post-Hashtag Relationship Table
CREATE TABLE post_hashtags (
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    hashtag_id INT REFERENCES hashtags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, hashtag_id)
);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    from_user_id INT REFERENCES users(id) ON DELETE CASCADE,
    post_id INT REFERENCES posts(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--- post_images Table
CREATE TABLE post_images (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL
);

--- Message Table
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES users(id),
    receiver_id BIGINT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---- Conservation Table
CREATE TABLE conversations (
    id BIGSERIAL PRIMARY KEY,
    user1_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_message_id BIGINT REFERENCES messages(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ràng buộc không cho chat với chính mình
    CONSTRAINT check_not_self_chat CHECK (user1_id <> user2_id),

    -- Ràng buộc duy nhất 1 đoạn chat giữa 2 người (sau khi đã sắp xếp user1 < user2)
    CONSTRAINT unique_user_pair UNIQUE (user1_id, user2_id)
);

--- Trigger
CREATE OR REPLACE FUNCTION enforce_user_order()
RETURNS TRIGGER AS $$
DECLARE
    temp BIGINT;
BEGIN
    IF NEW.user1_id > NEW.user2_id THEN
        temp := NEW.user1_id;
        NEW.user1_id := NEW.user2_id;
        NEW.user2_id := temp;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--- Add trigger into Conservation table
CREATE TRIGGER trigger_enforce_user_order
BEFORE INSERT ON conversations
FOR EACH ROW
EXECUTE FUNCTION enforce_user_order();

--- Add thêm conservation vào message table (cho nhỏ Nga)
ALTER TABLE messages
ADD COLUMN conversation_id BIGINT;

ALTER TABLE messages
ADD CONSTRAINT fk_conversation
FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
