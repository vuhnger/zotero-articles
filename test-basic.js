const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Zotero Git Sync - Basic Functionality\n');

// Test 1: Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file exists');
} else {
  console.log('❌ .env file missing - copy .env.example to .env');
  process.exit(1);
}

// Test 2: Check if config files exist
const configFiles = [
  'config.example.yaml',
  'package.json',
  'src/zotero-api-sync.js',
  '.github/workflows/sync.yml'
];

console.log('\n📁 Checking required files:');
configFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Test 3: Check Node.js dependencies
console.log('\n📦 Checking Node.js dependencies:');
try {
  const packageJson = require('./package.json');
  const dependencies = Object.keys(packageJson.dependencies);
  console.log(`  Found ${dependencies.length} dependencies: ${dependencies.join(', ')}`);
  console.log('  ✅ Dependencies configured');
} catch (error) {
  console.log('  ❌ Error reading package.json');
}

// Test 4: Show configuration status
console.log('\n🔑 Configuration Status:');
require('dotenv').config();

const configCheck = [
  { name: 'ZOTERO_API_KEY', value: process.env.ZOTERO_API_KEY, sensitive: true },
  { name: 'ZOTERO_USER_ID', value: process.env.ZOTERO_USER_ID },
  { name: 'ZOTERO_COLLECTION_ID', value: process.env.ZOTERO_COLLECTION_ID },
  { name: 'GIT_REPOSITORY_URL', value: process.env.GIT_REPOSITORY_URL },
  { name: 'EXPORT_PATH', value: process.env.EXPORT_PATH }
];

configCheck.forEach(config => {
  const set = !!config.value;
  const displayValue = config.sensitive ? '*** (set)' : (config.value || 'NOT SET');
  console.log(`  ${set ? '✅' : '❌'} ${config.name}: ${displayValue}`);
});

console.log('\n📖 Next Steps:');
console.log('1. Update .env with your actual Zotero credentials');
console.log('2. Run: node test-api.js (to test API connection)');
console.log('3. Run: node src/zotero-api-sync.js (full sync)');
console.log('4. Set up GitHub Actions for automatic syncing');

console.log('\n💡 Need help? See GETTING_STARTED.md for detailed instructions');