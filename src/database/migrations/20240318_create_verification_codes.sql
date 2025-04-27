-- Create verification_codes table
CREATE TABLE verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255),
  phone VARCHAR(20),
  code VARCHAR(10) NOT NULL,
  type VARCHAR(10) NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_contact CHECK (
    (type = 'email' AND email IS NOT NULL AND phone IS NULL) OR
    (type = 'phone' AND phone IS NOT NULL AND email IS NULL)
  )
);

-- Add indexes
CREATE INDEX idx_verification_codes_email ON verification_codes(email) WHERE type = 'email';
CREATE INDEX idx_verification_codes_phone ON verification_codes(phone) WHERE type = 'phone';
CREATE INDEX idx_verification_codes_expires_at ON verification_codes(expires_at);

-- Add columns to users table for verification status
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_phone_verified BOOLEAN DEFAULT FALSE;

-- Add unique constraints
ALTER TABLE users ADD CONSTRAINT unique_cpf UNIQUE (cpf);
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email); 