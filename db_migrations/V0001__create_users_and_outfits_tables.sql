CREATE TABLE IF NOT EXISTS t_p3162120_dress_by_photo.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS t_p3162120_dress_by_photo.outfits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p3162120_dress_by_photo.users(id),
    original_photo_url TEXT NOT NULL,
    result_photo_url TEXT NOT NULL,
    clothing_item_id INTEGER,
    clothing_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_outfits_user_id ON t_p3162120_dress_by_photo.outfits(user_id);
CREATE INDEX idx_outfits_created_at ON t_p3162120_dress_by_photo.outfits(created_at DESC);