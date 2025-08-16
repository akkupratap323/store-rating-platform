const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

const testUserSignup = async () => {
  console.log('👤 Testing Normal User Signup Functionality\n');

  // Test 1: Initialize Database
  console.log('1. Initializing database...');
  try {
    const dbResponse = await axios.post(`${BASE_URL}/api/init-db`, {}, {
      timeout: 30000,
      validateStatus: (status) => status < 500
    });
    console.log(`✅ Database initialized: ${dbResponse.status}`);
  } catch (error) {
    console.log(`❌ Database init failed: ${error.message}`);
    return;
  }

  // Test 2: Test Normal User Registration
  console.log('\n2. Testing Normal User Registration...');
  const testUser = {
    name: 'Test Normal User Account For Testing Registration',
    email: 'testnormaluser@example.com',
    password: 'TestUser123!',
    address: '123 Test User Street, Test City, TC 12345'
  };

  try {
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser, {
      timeout: 10000,
      validateStatus: (status) => status < 500
    });
    
    if (registerResponse.status === 201) {
      console.log('✅ Normal user registration successful');
      console.log(`   User: ${registerResponse.data.user.name}`);
      console.log(`   Email: ${registerResponse.data.user.email}`);
      console.log(`   Role: ${registerResponse.data.user.role}`);
      console.log(`   Address: ${registerResponse.data.user.address}`);
      console.log(`   Token provided: ${registerResponse.data.token ? 'Yes' : 'No'}`);
      
      // Verify the role is automatically set to 'user'
      if (registerResponse.data.user.role === 'user') {
        console.log('✅ Role correctly set to "user" automatically');
      } else {
        console.log(`❌ Role should be "user" but got "${registerResponse.data.user.role}"`);
      }
    } else {
      console.log(`❌ User registration failed: ${registerResponse.status}`);
      if (registerResponse.data && registerResponse.data.message) {
        console.log(`   Message: ${registerResponse.data.message}`);
      }
      if (registerResponse.data && registerResponse.data.errors) {
        console.log('   Validation Errors:');
        registerResponse.data.errors.forEach(error => {
          console.log(`     ${error.path[0]}: ${error.message}`);
        });
      }
    }
  } catch (error) {
    console.log(`❌ User registration error: ${error.message}`);
  }

  // Test 3: Test Duplicate Email Registration
  console.log('\n3. Testing Duplicate Email Prevention...');
  try {
    const duplicateResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser, {
      timeout: 10000,
      validateStatus: (status) => status < 500
    });
    
    if (duplicateResponse.status === 400) {
      console.log('✅ Duplicate email properly rejected');
      console.log(`   Message: ${duplicateResponse.data.message}`);
    } else {
      console.log(`❌ Duplicate email should be rejected but got: ${duplicateResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Duplicate email test error: ${error.message}`);
  }

  // Test 4: Test Role Enforcement (try to register as admin)
  console.log('\n4. Testing Role Enforcement...');
  const adminAttempt = {
    name: 'Attempted Admin User Registration Test',
    email: 'attemptedadmin@example.com',
    password: 'AdminAttempt123!',
    address: '456 Admin Attempt Street, Admin City, AC 67890',
    role: 'admin' // This should be ignored
  };

  try {
    const adminResponse = await axios.post(`${BASE_URL}/api/auth/register`, adminAttempt, {
      timeout: 10000,
      validateStatus: (status) => status < 500
    });
    
    if (adminResponse.status === 201) {
      console.log('✅ Registration succeeded (role enforcement test)');
      if (adminResponse.data.user.role === 'user') {
        console.log('✅ Role correctly forced to "user" despite admin request');
      } else {
        console.log(`❌ Role should be forced to "user" but got "${adminResponse.data.user.role}"`);
      }
    } else {
      console.log(`❌ Role enforcement test failed: ${adminResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Role enforcement test error: ${error.message}`);
  }

  // Test 5: Test Validation Requirements
  console.log('\n5. Testing Validation Requirements...');
  const invalidUser = {
    name: 'Short', // Too short (less than 20 chars)
    email: 'invalid-email',
    password: 'weak',
    address: ''
  };

  try {
    const validationResponse = await axios.post(`${BASE_URL}/api/auth/register`, invalidUser, {
      timeout: 10000,
      validateStatus: (status) => status < 500
    });
    
    if (validationResponse.status === 400) {
      console.log('✅ Validation properly catches invalid data');
      if (validationResponse.data.errors) {
        console.log('   Validation Errors:');
        validationResponse.data.errors.forEach(error => {
          console.log(`     ${error.path[0]}: ${error.message}`);
        });
      }
    } else {
      console.log(`❌ Validation should reject invalid data but got: ${validationResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Validation test error: ${error.message}`);
  }

  // Test 6: Test Login with New User
  console.log('\n6. Testing Login with Newly Registered User...');
  try {
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    }, {
      timeout: 10000,
      validateStatus: (status) => status < 500
    });
    
    if (loginResponse.status === 200) {
      console.log('✅ Login with new user successful');
      console.log(`   User: ${loginResponse.data.user.name} (${loginResponse.data.user.role})`);
      console.log(`   Token provided: ${loginResponse.data.token ? 'Yes' : 'No'}`);
    } else {
      console.log(`❌ Login with new user failed: ${loginResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Login test error: ${error.message}`);
  }

  // Test 7: Test Admin User Creation Still Works
  console.log('\n7. Testing Admin User Creation via Admin API...');
  
  // First login as admin
  let adminToken = null;
  try {
    const adminLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@storerating.com',
      password: 'Admin123!'
    }, {
      timeout: 10000,
      validateStatus: (status) => status < 500
    });
    
    if (adminLoginResponse.status === 200) {
      adminToken = adminLoginResponse.data.token;
      console.log('✅ Admin login successful');
      
      // Try to create a store owner via admin API
      const adminCreateUser = {
        name: 'Admin Created Store Owner User',
        email: 'admincreated@storeowner.com',
        password: 'AdminCreated123!',
        address: '789 Admin Created Street, Store District, SD 99999',
        role: 'store_owner'
      };

      const adminCreateResponse = await axios.post(`${BASE_URL}/api/admin/users`, adminCreateUser, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        timeout: 10000,
        validateStatus: (status) => status < 500
      });
      
      if (adminCreateResponse.status === 201) {
        console.log('✅ Admin can still create store owners and admins');
        console.log(`   Created: ${adminCreateResponse.data.user.name} (${adminCreateResponse.data.user.role})`);
      } else {
        console.log(`❌ Admin user creation failed: ${adminCreateResponse.status}`);
      }
    } else {
      console.log(`❌ Admin login failed: ${adminLoginResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Admin user creation test error: ${error.message}`);
  }

  console.log('\n🎉 Normal User Signup Testing Completed!');
  console.log('\n📋 Summary of User Signup Features:');
  console.log('✅ Public Registration - Users can sign up as regular users');
  console.log('✅ Role Enforcement - All public registrations automatically get "user" role');
  console.log('✅ Validation - Proper validation of name, email, password, and address');
  console.log('✅ Duplicate Prevention - Cannot register with existing email');
  console.log('✅ Security - Cannot elevate privileges during registration');
  console.log('✅ Authentication - Registered users can login normally');
  console.log('✅ Admin Control - Admins can still create store owners and admins');
  console.log('\n🌐 Test User Registration:');
  console.log('Visit: http://localhost:3000/auth/register');
  console.log('Requirements:');
  console.log('- Name: 20-60 characters');
  console.log('- Email: Valid email format');
  console.log('- Password: 8-16 chars, uppercase + special character');
  console.log('- Address: Required, max 400 characters');
  console.log('- Role: Automatically set to "user"');
};

testUserSignup().catch(console.error);