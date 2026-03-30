# Getting Started with Zotero Git Sync

## Step 1: Get Your Zotero API Key

1. **Go to Zotero API Settings**:
   - Visit [https://www.zotero.org/settings/keys](https://www.zotero.org/settings/keys)
   - Sign in if prompted

2. **Create a new API key**:
   - Click "Create new private key"
   - Name it "GitHub Sync" or similar
   - Set permissions to "Allow library access" (read-only is fine)
   - Click "Save"

3. **Copy your API key**:
   - The key will look like: `KOBBJH5uH1X12Vk80h0Zrjc5`
   - This is already in your `.env` file

## Step 2: Find Your Numeric User ID

**IMPORTANT**: This is NOT your username! It's a number.

1. **Look at the top of the API settings page**:
   - You'll see: "Your userID for use in API calls is: **1234567**"
   - Copy this number

2. **OR find it in your profile URL**:
   - Go to your Zotero profile
   - The URL will be: `https://www.zotero.org/users/**1234567**/`
   - Copy the number part

3. **Update your `.env` file**:
   ```bash
   # Replace this line in .env:
   ZOTERO_USER_ID=1234567  # Replace with YOUR actual numeric user ID
   ```

## Step 3: Find Your Collection ID

1. **Go to your Zotero library**:
   - Visit [https://www.zotero.org](https://www.zotero.org)
   - Navigate to the collection you want to sync

2. **Look at the browser URL**:
   - Format: `https://www.zotero.org/users/**1234567**/collections/**ABCDEFG**`
   - The **ABCDEFG** part is your collection ID
   - It's usually 8 characters (letters and numbers)

3. **Update your `.env` file**:
   ```bash
   # Replace this line in .env:
   ZOTERO_COLLECTION_ID=ABCDEFG  # Replace with YOUR actual collection ID
   ```

## Step 4: Test the Connection

Run the test script:
```bash
node test-api.js
```

If successful, you'll see:
```
✅ API connection successful!
Found X items in collection
```

## Step 5: Run the Full Sync

```bash
node src/zotero-api-sync.js
```

## Step 6: Set Up GitHub Actions (Optional)

1. **Create a GitHub repository** for your sync
2. **Add secrets to GitHub**:
   - Go to: Repository Settings > Secrets > Actions
   - Add these secrets:
     - `ZOTERO_API_KEY` = Your Zotero API key
     - `ZOTERO_USER_ID` = Your numeric user ID
     - `ZOTERO_COLLECTION_ID` = Your collection ID
     - `GIT_REPOSITORY_URL` = SSH URL of your repo (e.g., `git@github.com:yourname/repo.git`)

3. **Push your code** to GitHub:
   ```bash
   git push origin main
   ```

4. **Watch it run automatically** every hour!

## Troubleshooting

### "403 Forbidden" Error
- **Cause**: Wrong API key, user ID, or collection ID
- **Fix**: Double-check all credentials in `.env` file

### "404 Not Found" Error  
- **Cause**: Wrong user ID or collection ID
- **Fix**: Verify the IDs are correct

### "No items found"
- **Cause**: Collection might be empty or private
- **Fix**: Check collection permissions in Zotero

### Git errors
- **Cause**: Git not configured properly
- **Fix**: Make sure you have SSH keys set up for GitHub

## Need Help?

The Zotero API documentation is available at:
- [https://www.zotero.org/support/dev/web_api/v3/start](https://www.zotero.org/support/dev/web_api/v3/start)