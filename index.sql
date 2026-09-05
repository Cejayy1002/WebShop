PRAGMA foreign_keys = ON;

-- Normal accounts created through signup. Store a password hash produced by
-- a password hashing library when database authentication is added.
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    profile_image TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- The application has exactly one fixed administrator account.
CREATE TABLE IF NOT EXISTS admin_account (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL DEFAULT 'Cadungog C.',
    profile_image TEXT NOT NULL DEFAULT 'user-img.jpg',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Saved website and social-media credentials.
CREATE TABLE IF NOT EXISTS password_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    platform TEXT NOT NULL,
    handle TEXT NOT NULL,
    password TEXT NOT NULL,
    url TEXT,
    logo TEXT,
    favorite INTEGER NOT NULL DEFAULT 0
        CHECK (favorite IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Files saved in browser storage as data URLs can be stored in file_data.
CREATE TABLE IF NOT EXISTS important_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    mime_type TEXT,
    file_size TEXT,
    file_data TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Personal notes.
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- GitHub repository links saved by a user.
CREATE TABLE IF NOT EXISTS github_repositories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- User preferences such as light/dark theme.
CREATE TABLE IF NOT EXISTS user_settings (
    user_id INTEGER PRIMARY KEY,
    theme TEXT NOT NULL DEFAULT 'light'
        CHECK (theme IN ('light', 'dark')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_password_accounts_user_id
    ON password_accounts (user_id);

CREATE INDEX IF NOT EXISTS idx_important_files_user_id
    ON important_files (user_id);

CREATE INDEX IF NOT EXISTS idx_notes_user_id
    ON notes (user_id);

CREATE INDEX IF NOT EXISTS idx_github_repositories_user_id
    ON github_repositories (user_id);