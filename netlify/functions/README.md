# ⚠️ IMPORTANT: Dummy Credentials File

This is a **placeholder** file that allows Netlify to build successfully.

## How it works:

1. **During build**: Netlify sees this file exists, so the `require('./credentials.json')` doesn't fail
2. **At runtime**: The function checks for `GOOGLE_CREDENTIALS` environment variable first
3. **If env var exists**: Uses that instead of this file
4. **If env var doesn't exist**: Falls back to this file (which will fail with placeholder values)

## What you need to do:

**Set the `GOOGLE_CREDENTIALS` environment variable in Netlify dashboard** with your real credentials.

The function will automatically use the environment variable instead of this file.

## Security Note:

This file contains only placeholder values and is safe to commit to Git.

Your real credentials should ONLY be in the Netlify environment variable, never in Git.
