# Zotero Git Sync

Sync your Zotero collection publications to a Git repository automatically using the Zotero API.

## Features

- ✅ Syncs Zotero collection publications to Git
- ✅ Uses Zotero API (no file system access needed)
- ✅ Automatic Git commits and pushes
- ✅ Works across multiple devices
- ✅ Configurable via environment variables or YAML
- ✅ GitHub Actions support for automatic syncing

## How It Works

1. Fetches publications from a Zotero collection using the Zotero API
2. Generates a markdown file with all publications
3. Commits changes to a Git repository
4. Pushes to remote (GitHub, GitLab, etc.)

## Installation

### Prerequisites

- Node.js v16+
- Git
- Zotero account with API key
- GitHub repository

### Setup

```bash
# Clone this repository
git clone https://github.com/vuhnger/zotero-sync.git
cd zotero-sync

# Install dependencies
npm install

# Copy example config
cp config.example.yaml config.yaml

# Edit config.yaml with your Zotero and GitHub details
```

## Configuration

### Using config.yaml (recommended)

Create `config.yaml`:

```yaml
# GitHub repository URL (SSH format recommended)
gitRepositoryUrl: git@github.com:yourusername/your-repo.git

# Git commit author information
gitName: Your Name
gitEmail: your.email@example.com

# Zotero API credentials (get from https://zotero.org/settings/keys)
zoteroApiKey: your-api-key-here
zoteroUserId: your-user-id-here  # Find in Zotero settings
zoteroCollectionId: your-collection-id-here  # From collection URL

# Export settings
exportPath: zotero-export.md  # Output file name
commitMessage: "Update Zotero export"  # Git commit message
```

### Using Environment Variables

Alternatively, you can use environment variables:

```bash
export ZOTERO_API_KEY="your-api-key"
export ZOTERO_USER_ID="your-user-id"
export ZOTERO_COLLECTION_ID="your-collection-id"
export GIT_REPOSITORY_URL="git@github.com:yourusername/your-repo.git"
export GIT_NAME="Your Name"
export GIT_EMAIL="your.email@example.com"
export EXPORT_PATH="zotero-export.md"
export COMMIT_MESSAGE="Update Zotero export"
```

## Usage

### Manual Sync

```bash
# Run sync
npm start

# Or using npx
npx zotero-git-sync
```

### Automatic Sync with GitHub Actions

Create `.github/workflows/sync.yml`:

```yaml
name: Zotero Sync

on:
  schedule:
    - cron: '0 * * * *'  # Run hourly
  workflow_dispatch:  # Allow manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Run Zotero sync
        env:
          ZOTERO_API_KEY: ${{ secrets.ZOTERO_API_KEY }}
          ZOTERO_USER_ID: ${{ secrets.ZOTERO_USER_ID }}
          ZOTERO_COLLECTION_ID: ${{ secrets.ZOTERO_COLLECTION_ID }}
          GIT_REPOSITORY_URL: ${{ secrets.GIT_REPOSITORY_URL }}
          GIT_NAME: "Zotero Sync Bot"
          GIT_EMAIL: "zotero-sync@example.com"
        run: npm start
      
      - name: Push changes
        run: |
          git config --global user.name "Zotero Sync Bot"
          git config --global user.email "zotero-sync@example.com"
          git add .
          git commit -m "Auto-sync Zotero publications" || echo "No changes to commit"
          git push
```

Add these secrets to your GitHub repository:
- `ZOTERO_API_KEY`
- `ZOTERO_USER_ID`
- `ZOTERO_COLLECTION_ID`
- `GIT_REPOSITORY_URL` (SSH format)

## Getting Started

For detailed step-by-step instructions, see [GETTING_STARTED.md](GETTING_STARTED.md)

### Quick Credentials Guide

### 1. Get Your API Key

1. Go to [Zotero API Settings](https://www.zotero.org/settings/keys)
2. Click "Create new private key"
3. Give it a name (e.g., "GitHub Sync")
4. Set permissions to "Allow library access" (read-only is sufficient)
5. Copy the generated API key

### 2. Find Your Numeric User ID

Your **numeric user ID** is shown at the top of the API settings page:
- It's NOT your username
- It's a number like `1234567`
- You can also find it in your profile URL: `https://www.zotero.org/users/1234567/`

### 3. Find Your Collection ID

1. Go to your Zotero library
2. Open the collection you want to sync
3. Look at the URL in your browser:
   - Format: `https://www.zotero.org/users/1234567/collections/ABCDEFG`
   - The `ABCDEFG` part is your collection ID
4. Use this collection ID in your configuration

### Example Configuration

```yaml
zoteroApiKey: "KOBBJH5uH1X12Vk80h0Zrjc5"
zoteroUserId: "1234567"  # Your NUMERIC user ID
zoteroCollectionId: "ABCDEFG"  # Your collection ID
gitRepositoryUrl: "git@github.com:yourusername/your-repo.git"
```

## Cross-Device Syncing

This solution works across multiple devices because:

1. **Uses Zotero API** - No direct file system access needed
2. **Git-based** - All changes are version controlled
3. **Automatic** - GitHub Actions can run on schedule
4. **Portable** - Works anywhere with Node.js and Git

## License

MIT