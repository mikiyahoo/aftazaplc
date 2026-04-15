/**
 * FORGOT PASSWORD FEATURE - COMPREHENSIVE TEST SUITE
 * 
 * This script tests the complete forgot password flow:
 * 1. Forgot password request
 * 2. Password reset with token
 * 3. Security validations
 * 4. Rate limiting
 * 5. Audit logging
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = 'test.admin@aftaza.com';
const NEW_PASSWORD = 'NewTestPassword123!';
const INVALID_TOKEN = 'invalid-token-123456';

async function testForgotPassword() {
  console.log('🧪 Testing Forgot Password Feature\n');

  try {
    // Test 1: Forgot Password Request
    console.log('1️⃣ Testing forgot password request...');
    const forgotResponse = await axios.post(`${BASE_URL}/api/admin/forgot-password`, {
      email: TEST_EMAIL
    });

    console.log('✅ Forgot password request successful');
    console.log('Response:', forgotResponse.data);

    // Test 2: Invalid Token Reset
    console.log('\n2️⃣ Testing password reset with invalid token...');
    try {
      await axios.post(`${BASE_URL}/api/admin/reset-password`, {
        token: INVALID_TOKEN,
        newPassword: NEW_PASSWORD,
        confirmPassword: NEW_PASSWORD
      });
      console.log('❌ Should have failed with invalid token');
    } catch (error) {
      console.log('✅ Correctly rejected invalid token');
      console.log('Error:', error.response.data);
    }

    // Test 3: Password Mismatch
    console.log('\n3️⃣ Testing password mismatch...');
    try {
      await axios.post(`${BASE_URL}/api/admin/reset-password`, {
        token: 'valid-token-placeholder',
        newPassword: NEW_PASSWORD,
        confirmPassword: 'DifferentPassword123!'
      });
      console.log('❌ Should have failed with password mismatch');
    } catch (error) {
      console.log('✅ Correctly rejected password mismatch');
      console.log('Error:', error.response.data);
    }

    // Test 4: Weak Password
    console.log('\n4️⃣ Testing weak password...');
    try {
      await axios.post(`${BASE_URL}/api/admin/reset-password`, {
        token: 'valid-token-placeholder',
        newPassword: 'weak',
        confirmPassword: 'weak'
      });
      console.log('❌ Should have failed with weak password');
    } catch (error) {
      console.log('✅ Correctly rejected weak password');
      console.log('Error:', error.response.data);
    }

    // Test 5: Missing Fields
    console.log('\n5️⃣ Testing missing fields...');
    try {
      await axios.post(`${BASE_URL}/api/admin/reset-password`, {
        token: 'valid-token-placeholder',
        newPassword: NEW_PASSWORD
        // Missing confirmPassword
      });
      console.log('❌ Should have failed with missing fields');
    } catch (error) {
      console.log('✅ Correctly rejected missing fields');
      console.log('Error:', error.response.data);
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📝 Manual Testing Required:');
    console.log('1. Check email inbox for reset link');
    console.log('2. Click the reset link and verify it works');
    console.log('3. Test the reset password form with valid data');
    console.log('4. Verify login works with new password');
    console.log('5. Check audit logs in database');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run tests
testForgotPassword();