-- Migration: Add Licenses System
-- Description: Create tables for managing user licenses for assets
-- Date: 2025-12-01

-- Main Licenses table
CREATE TABLE IF NOT EXISTS Licenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  license_type ENUM('personal', 'commercial') NOT NULL,
  license_key VARCHAR(255) UNIQUE NOT NULL,
  status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  last_verified_at TIMESTAMP NULL,
  metadata JSON NULL,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_license_key (license_key),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Asset Licenses junction table (links licenses to purchased assets)
CREATE TABLE IF NOT EXISTS Asset_Licenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  license_id INT NOT NULL,
  asset_id INT NOT NULL,
  asset_name VARCHAR(255) NOT NULL,
  purchase_price INT NOT NULL,
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (license_id) REFERENCES Licenses(id) ON DELETE CASCADE,
  INDEX idx_license_id (license_id),
  INDEX idx_asset_id (asset_id),
  UNIQUE KEY unique_license_asset (license_id, asset_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- License Usage tracking (optional - for analytics)
CREATE TABLE IF NOT EXISTS License_Usage (
  id INT PRIMARY KEY AUTO_INCREMENT,
  license_id INT NOT NULL,
  usage_type VARCHAR(100),
  usage_metadata JSON NULL,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (license_id) REFERENCES Licenses(id) ON DELETE CASCADE,
  INDEX idx_license_id (license_id),
  INDEX idx_used_at (used_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- License History (track status changes)
CREATE TABLE IF NOT EXISTS License_History (
  id INT PRIMARY KEY AUTO_INCREMENT,
  license_id INT NOT NULL,
  previous_status ENUM('active', 'expired', 'cancelled'),
  new_status ENUM('active', 'expired', 'cancelled'),
  changed_by INT NULL,
  reason VARCHAR(500),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (license_id) REFERENCES Licenses(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES Users(id) ON DELETE SET NULL,
  INDEX idx_license_id (license_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
