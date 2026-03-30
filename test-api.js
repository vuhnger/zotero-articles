const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.ZOTERO_API_KEY;
const userId = process.env.ZOTERO_USER_ID;
const collectionId = process.env.ZOTERO_COLLECTION_ID;

console.log('Testing Zotero API connection...');
console.log('API Key:', apiKey ? '*** (set)' : 'NOT SET');
console.log('User ID:', userId || 'NOT SET');
console.log('Collection ID:', collectionId || 'NOT SET');

if (!apiKey || !userId || !collectionId) {
  console.log('\nPlease set all required environment variables in .env file');
  process.exit(1);
}

// Test basic API access
const testUrl = `https://api.zotero.org/users/${userId}/collections/${collectionId}/items`;

axios.get(testUrl, {
  params: {
    key: apiKey,
    format: 'json',
    limit: 1  // Just get one item to test
  }
})
.then(response => {
  console.log('\n✅ API connection successful!');
  console.log('Found', response.data.length, 'items in collection');
  if (response.data.length > 0) {
    console.log('First item:', response.data[0].data.title || 'No title');
  }
})
.catch(error => {
  console.error('\n❌ API connection failed:');
  console.error('Status:', error.response ? error.response.status : 'Unknown');
  console.error('Message:', error.message);
  if (error.response && error.response.data) {
    console.error('Response:', error.response.data);
  }
  
  console.log('\nTroubleshooting tips:');
  console.log('1. Verify your API key is correct');
  console.log('2. Make sure your User ID is numeric (not username)');
  console.log('3. Check that the Collection ID is correct');
  console.log('4. Visit https://www.zotero.org/settings/keys to verify your API key');
  console.log('5. Test the URL in your browser: ' + testUrl.replace(apiKey, 'YOUR_KEY'));
});