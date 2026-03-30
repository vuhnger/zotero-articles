#!/usr/bin/env node

/**
 * Zotero Git Sync - Node.js version
 * Syncs Zotero collection publications to a Git repository using Zotero API
 * Inspired by: https://github.com/janheinrichmerker/zotero-git-sync
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const axios = require('axios');
const yaml = require('js-yaml');
const simpleGit = require('simple-git');
require('dotenv').config(); // Load .env file

// Configuration
const config = {
  zoteroApiKey: process.env.ZOTERO_API_KEY,
  zoteroUserId: process.env.ZOTERO_USER_ID,
  zoteroCollectionId: process.env.ZOTERO_COLLECTION_ID,
  gitRepositoryUrl: process.env.GIT_REPOSITORY_URL,
  gitName: process.env.GIT_NAME || 'Zotero Sync',
  gitEmail: process.env.GIT_EMAIL || 'zotero-sync@example.com',
  exportPath: process.env.EXPORT_PATH || 'zotero-export.md',
  commitMessage: process.env.COMMIT_MESSAGE || 'Update Zotero export',
  workingDir: process.env.WORKING_DIR || process.cwd()
};

// Validate configuration
function validateConfig() {
  const requiredFields = [
    'zoteroApiKey',
    'zoteroUserId', 
    'zoteroCollectionId',
    'gitRepositoryUrl'
  ];

  const missingFields = requiredFields.filter(field => !config[field]);
  if (missingFields.length > 0) {
    console.error('Missing required configuration fields:', missingFields.join(', '));
    console.error('Please set these environment variables or create a config.yaml file');
    process.exit(1);
  }
}

// Load configuration from YAML file if it exists
function loadConfigFromYaml() {
  const configPath = path.join(config.workingDir, 'config.yaml');
  if (fs.existsSync(configPath)) {
    try {
      const yamlConfig = yaml.load(fs.readFileSync(configPath, 'utf8'));
      Object.assign(config, yamlConfig);
      console.log('Loaded configuration from config.yaml');
    } catch (error) {
      console.error('Error loading config.yaml:', error.message);
      process.exit(1);
    }
  }
}

// Initialize Git repository
async function initGitRepo() {
  const git = simpleGit(config.workingDir);
  
  try {
    // Check if repository exists
    await git.checkIsRepo();
  } catch (error) {
    // Initialize new repository
    await git.init();
    console.log('Initialized new Git repository');
  }
  
  // Configure git user
  await git.addConfig('user.name', config.gitName);
  await git.addConfig('user.email', config.gitEmail);
  
  // Add remote if not exists
  try {
    await git.getRemotes(true);
  } catch (error) {
    await git.addRemote('origin', config.gitRepositoryUrl);
    console.log('Added Git remote:', config.gitRepositoryUrl);
  }
}

// Fetch publications from Zotero API
async function fetchZoteroPublications() {
  const apiUrl = `https://api.zotero.org/users/${config.zoteroUserId}/collections/${config.zoteroCollectionId}/items`;
  
  try {
    // First get the items in the collection
    const response = await axios.get(apiUrl, {
      params: {
        key: config.zoteroApiKey,
        format: 'json'
      }
    });
    
    if (!response.data || response.data.length === 0) {
      console.log('No items found in this collection');
      return [];
    }
    
    // Get bibliographic data for each item
    const publications = [];
    for (const item of response.data) {
      if (item.data.itemType === 'attachment') continue;
      
      const bibUrl = `https://api.zotero.org/users/${config.zoteroUserId}/items/${item.data.key}`;
      const bibResponse = await axios.get(bibUrl, {
        params: {
          key: config.zoteroApiKey,
          format: 'bib',
          style: 'apa'
        }
      });
      
      publications.push({
        key: item.data.key,
        bib: bibResponse.data
      });
    }
    
    return publications;
  } catch (error) {
    console.error('Error fetching from Zotero API:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.status, error.response.statusText);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Generate markdown export
function generateMarkdownExport(publications) {
  let markdown = `# Zotero Collection Export\n\n`;
  markdown += `Last updated: ${new Date().toISOString()}\n\n`;
  markdown += `---\n\n`;
  
  publications.forEach((pub, index) => {
    markdown += `## Publication ${index + 1}\n\n`;
    markdown += `${pub.bib}\n\n`;
    markdown += `---\n\n`;
  });
  
  return markdown;
}

// Write export to file
function writeExportFile(content) {
  const exportPath = path.join(config.workingDir, config.exportPath);
  
  try {
    fs.writeFileSync(exportPath, content, 'utf8');
    console.log(`Wrote export to: ${exportPath}`);
    return exportPath;
  } catch (error) {
    console.error('Error writing export file:', error.message);
    process.exit(1);
  }
}

// Commit and push changes
async function commitAndPush(exportPath) {
  const git = simpleGit(config.workingDir);
  
  try {
    // Check if there are changes
    const status = await git.status();
    if (status.files.length === 0) {
      console.log('No changes to commit');
      return;
    }
    
    // Add changes
    await git.add(exportPath);
    
    // Commit changes
    await git.commit(config.commitMessage);
    console.log(`Committed changes: "${config.commitMessage}"`);
    
    // Push to remote
    await git.push('origin', 'main');
    console.log('Pushed changes to remote repository');
    
  } catch (error) {
    console.error('Error committing/pushing changes:', error.message);
    process.exit(1);
  }
}

// Main function
async function main() {
  console.log('Starting Zotero Git Sync...');
  
  // Load configuration
  loadConfigFromYaml();
  validateConfig();
  
  // Initialize Git repository
  await initGitRepo();
  
  // Fetch publications from Zotero
  console.log('Fetching publications from Zotero...');
  const publications = await fetchZoteroPublications();
  
  // Generate markdown export
  console.log('Generating markdown export...');
  const markdown = generateMarkdownExport(publications);
  
  // Write export file
  const exportPath = writeExportFile(markdown);
  
  // Commit and push changes
  await commitAndPush(exportPath);
  
  console.log('Zotero Git Sync completed successfully!');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});