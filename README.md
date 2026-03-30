# Zotero Sync

A simple script to sync Zotero research files to a GitHub repository.

## Features

- Syncs files from Zotero storage to a GitHub repository
- Ignores common files like .git, node_modules, and .DS_Store
- Automatically commits changes with a customizable message
- Works on macOS, Linux, and Windows

## Prerequisites

- Node.js (v12 or later)
- Git
- Zotero installed with research files
- A GitHub repository to sync to

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/zotero-sync.git
   cd zotero-sync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
ZOTERO_STORAGE_PATH=/path/to/your/zotero/storage
GITHUB_REPO_PATH=/path/to/your/github/repo
COMMIT_MESSAGE=Your custom commit message
```

If no `.env` file is provided, the script will use default values:
- Zotero storage path: `~/Zotero/storage` (or equivalent on Windows)
- GitHub repo path: Current working directory
- Commit message: "Sync Zotero files"

## Usage

Run the sync script:

```bash
node src/sync.js
```

## How It Works

1. The script initializes a Git repository in the target directory (if not already initialized)
2. It copies all files from your Zotero storage directory to the GitHub repository
3. It commits all changes with your specified commit message
4. Files in `.git`, `node_modules`, and `.DS_Store` are automatically ignored

## Customization

You can customize the behavior by modifying the `config` object in `src/sync.js`:

```javascript
const config = {
  zoteroStoragePath: process.env.ZOTERO_STORAGE_PATH || path.join(process.env.HOME || process.env.USERPROFILE, 'Zotero', 'storage'),
  githubRepoPath: process.env.GITHUB_REPO_PATH || process.cwd(),
  ignorePatterns: ['.git', 'node_modules', '.DS_Store'],
  commitMessage: process.env.COMMIT_MESSAGE || 'Sync Zotero files'
};
```

## License

MIT