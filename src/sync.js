// Zotero Sync Script
// This script syncs Zotero research files to a GitHub repository

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  zoteroStoragePath: process.env.ZOTERO_STORAGE_PATH || path.join(process.env.HOME || process.env.USERPROFILE, 'Zotero', 'storage'),
  githubRepoPath: process.env.GITHUB_REPO_PATH || process.cwd(),
  ignorePatterns: ['.git', 'node_modules', '.DS_Store'],
  commitMessage: process.env.COMMIT_MESSAGE || 'Sync Zotero files'
};

// Ensure the GitHub repository is initialized
function ensureGitRepo() {
  try {
    execSync('git init', { cwd: config.githubRepoPath, stdio: 'pipe' });
    execSync('git config user.name "Zotero Sync"', { cwd: config.githubRepoPath, stdio: 'pipe' });
    execSync('git config user.email "zotero-sync@example.com"', { cwd: config.githubRepoPath, stdio: 'pipe' });
  } catch (error) {
    console.error('Error initializing Git repository:', error.message);
    process.exit(1);
  }
}

// Check if a file should be ignored
function shouldIgnore(filePath) {
  return config.ignorePatterns.some(pattern => filePath.includes(pattern));
}

// Copy files from Zotero storage to GitHub repository
function copyFiles() {
  const files = fs.readdirSync(config.zoteroStoragePath);
  
  files.forEach(file => {
    const srcPath = path.join(config.zoteroStoragePath, file);
    const destPath = path.join(config.githubRepoPath, file);
    
    if (shouldIgnore(file)) {
      console.log(`Skipping ignored file: ${file}`);
      return;
    }
    
    try {
      const stat = fs.statSync(srcPath);
      if (stat.isDirectory()) {
        // Handle directories (recursively)
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        // Recursively copy directory contents
        const subFiles = fs.readdirSync(srcPath);
        subFiles.forEach(subFile => {
          const subSrcPath = path.join(srcPath, subFile);
          const subDestPath = path.join(destPath, subFile);
          if (!shouldIgnore(subFile)) {
            fs.copyFileSync(subSrcPath, subDestPath);
            console.log(`Copied: ${subFile}`);
          }
        });
      } else {
        // Handle files
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${file}`);
      }
    } catch (error) {
      console.error(`Error copying ${file}:`, error.message);
    }
  });
}

// Commit changes to Git
function commitChanges() {
  try {
    execSync('git add .', { cwd: config.githubRepoPath, stdio: 'pipe' });
    execSync(`git commit -m "${config.commitMessage}"`, { cwd: config.githubRepoPath, stdio: 'pipe' });
    console.log('Changes committed successfully');
  } catch (error) {
    console.error('Error committing changes:', error.message);
  }
}

// Main function
function main() {
  console.log('Starting Zotero sync...');
  console.log(`Zotero storage path: ${config.zoteroStoragePath}`);
  console.log(`GitHub repo path: ${config.githubRepoPath}`);
  
  ensureGitRepo();
  copyFiles();
  commitChanges();
  
  console.log('Zotero sync completed!');
}

// Run the script
main();