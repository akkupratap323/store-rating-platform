const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

const testPages = async () => {
  const pages = [
    '/',
    '/auth/login',
    '/auth/register',
    '/api/init-db'
  ];

  console.log('Testing pages...\n');

  for (const page of pages) {
    try {
      const response = await axios.get(`${BASE_URL}${page}`, {
        timeout: 10000,
        validateStatus: (status) => status < 500 // Accept anything less than 500 as success
      });
      console.log(`✅ ${page}: ${response.status} (${response.statusText})`);
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${page}: ${error.response.status} (${error.response.statusText})`);
      } else {
        console.log(`❌ ${page}: ${error.message}`);
      }
    }
  }

  // Test database initialization
  try {
    console.log('\n🗄️  Testing database initialization...');
    const dbResponse = await axios.post(`${BASE_URL}/api/init-db`, {}, {
      timeout: 30000,
      validateStatus: (status) => status < 500
    });
    console.log(`✅ Database init: ${dbResponse.status} - ${dbResponse.data.message}`);
  } catch (error) {
    if (error.response) {
      console.log(`❌ Database init: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    } else {
      console.log(`❌ Database init: ${error.message}`);
    }
  }
};

testPages().catch(console.error);