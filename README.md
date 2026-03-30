# Zotero Sync

Sync your Zotero research files to a GitHub repository automatically.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure:**
   ```bash
   cp .env.example .env
   # Edit .env with your paths
   ```

3. **Run:**
   ```bash
   node src/sync.js
   ```

## Configuration

Edit `.env` file:
- `ZOTERO_STORAGE_PATH`: Path to your Zotero storage (default: `~/Zotero/storage`)
- `GITHUB_REPO_PATH`: Path to your GitHub repo (default: current directory)
- `COMMIT_MESSAGE`: Custom commit message (default: "Sync Zotero files")

## How It Works

1. Copies all files from Zotero storage to GitHub repo
2. Initializes git repo if needed
3. Commits changes automatically
4. Ignores `.git`, `node_modules`, `.DS_Store`

## Requirements

- Node.js v12+
- Git
- Zotero installed
- GitHub repository

## License

MIT