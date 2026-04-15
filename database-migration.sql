-- ============================================
-- FORGOT PASSWORD FEATURE - DATABASE MIGRATION
-- ============================================
-- Add reset token fields to accounts table

ALTER TABLE accounts 
ADD COLUMN reset_token VARCHAR(255),
ADD COLUMN reset_token_expires TIMESTAMP;

-- Create indexes for performance
CREATE INDEX idx_accounts_reset_token ON accounts(reset_token);
CREATE INDEX idx_accounts_reset_token_expires ON accounts(reset_token_expires);

-- Verify the migration
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'accounts' 
AND column_name IN ('reset_token', 'reset_token_expires')
ORDER BY column_name;

-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================
-- Insert a test admin account (password: TestPassword123!)
-- Note: This is for testing only, remove in production

INSERT INTO accounts (id, name, email, password_hash, role, email_verified) VALUES 
('test-admin-123', 'Test Admin', 'test.admin@aftaza.com', 
'$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
'admin', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Check if the columns were added successfully
SELECT 
    'reset_token' as column_name,
    CASE WHEN reset_token IS NULL THEN 'NULL' ELSE 'NOT NULL' END as current_value,
    'VARCHAR(255)' as expected_type
FROM accounts 
WHERE id = 'test-admin-123'

UNION ALL

SELECT 
    'reset_token_expires' as column_name,
    CASE WHEN reset_token_expires IS NULL THEN 'NULL' ELSE 'NOT NULL' END as current_value,
    'TIMESTAMP' as expected_type
FROM accounts 
WHERE id = 'test-admin-123';

-- Check indexes were created
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'accounts' 
AND indexname LIKE '%reset_token%';

-- ============================================
-- CLEANUP (Optional - for testing only)
-- ============================================
-- To remove test data after testing:
-- DELETE FROM accounts WHERE id = 'test-admin-123';