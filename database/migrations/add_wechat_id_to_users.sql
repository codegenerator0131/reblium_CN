-- Migration: Add wechat_id column to Users table
-- Date: 2025-12-04
-- Description: Adds support for WeChat OAuth authentication

ALTER TABLE Users ADD COLUMN wechat_id VARCHAR(255) NULL AFTER discord_id;

-- Create index for faster lookups
CREATE INDEX idx_wechat_id ON Users(wechat_id);
