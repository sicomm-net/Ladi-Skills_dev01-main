# Repository Rules

## Commit Protocol & Message Formatting
- When committing changes, format the commit message with:
  `.(<version>_<message>`
- Determine `<version>` by running:
  `bash .agents/scripts/get-version.sh next git`
- After committing:
  - Run `git update-index --refresh` to sync the repository index stat cache.
  - Instruct or prompt the user to refresh the VS Code Source Control panel (`Ctrl`+`Shift`+`G` -> Refresh icon) if working tree status lags.

## File Versioning & Archival Rules
- **Never update files containing `_v[0-9]`**: Files with `_v[0-9]` in their name (e.g., `*_v1.10*`) are archived, immutable versions. Never modify, overwrite, or delete them.
- **Editable files**: Files with or without `_u[0-9]` (e.g., `*_u1.11*` or unversioned files) represent active working copies and are the current versions you can edit.

## Environment & Configuration Standards
- **`.env` files (Server app folders)**:
  - Contain **ONLY** strictly private secrets, credentials, API keys, and passwords (e.g., `X_BEARER_TOKEN`).
  - Must never contain general configuration, URLs, ports, or non-secret options.
- **`_config.js` files (Client and Server app folders)**:
  - Located in both client (`client/c##_*/_config.js`) and server (`server/s##_*/_config.js`) app folders.
  - Contain application paths, ports, endpoints, options, and runtime flags.
  - Must include a variable/switch for data modes:
    `DATA_MODE = 'Mock' | 'Live'`
    to switch between mock fixtures and live upstream services.
