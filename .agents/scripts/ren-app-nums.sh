#!/bin/bash
# ==============================================================================
# Script: ren-app-nums.sh
# Purpose: Find the first folder in ./docs matching a given app number,
#          then recursively rename all files (and subdirectories) starting
#          with a[0-9]{2}[-_] or a##[-_] to use the target app number prefix.
#
# Usage:
#   ./ren-app-nums.sh <appNum> [--dry-run|-n]
#
# Arguments:
#   $1 (appNum): Target application number in any of these forms:
#                "02", "a02", "a02_", "a02-"
#   --dry-run / -n: Optional flag to simulate renames without modifying files.
#
# Examples:
#   ./ren-app-nums.sh 02
#   ./ren-app-nums.sh a02
#   ./ren-app-nums.sh a02_
#   ./ren-app-nums.sh 02 --dry-run
# ==============================================================================

set -euo pipefail

# Parse arguments
bDryRun=0
aRawArg=""

for arg in "$@"; do
    if [ "$arg" = "--dry-run" ] || [ "$arg" = "-n" ]; then
        bDryRun=1
    elif [ -z "$aRawArg" ]; then
        aRawArg="$arg"
    fi
done

if [ -z "$aRawArg" ]; then
    echo "Error: Missing required appNum argument." >&2
    echo "Usage: $0 <appNum> [--dry-run|-n]" >&2
    echo "Example: $0 02" >&2
    echo "         $0 a02" >&2
    echo "         $0 a02_" >&2
    exit 1
fi

# Normalize appNum argument:
# Strip leading 'a' if present, strip trailing '_' or '-' if present
aClean="${aRawArg#a}"
aClean="${aClean%_}"
aClean="${aClean%-}"

if [[ "$aClean" =~ ^[0-9]$ ]]; then
    printf -v aNN "%02d" "$aClean"
elif [[ "$aClean" =~ ^[0-9]{2}$ ]]; then
    aNN="$aClean"
else
    echo "Error: Invalid appNum '$aRawArg'. Expected 2-digit format like '02', 'a02', or 'a02_'." >&2
    exit 1
fi

aTargetPrefix="a${aNN}"

# Locate the ./docs directory
aDocsDir=""
if [ -d "./docs" ]; then
    aDocsDir="./docs"
elif [ -d "../docs" ]; then
    aDocsDir="../docs"
else
    # Fallback to repo root based on script location (.agents/scripts/..)
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    repo_root="$(cd "$script_dir/../.." && pwd)"
    if [ -d "$repo_root/docs" ]; then
        aDocsDir="$repo_root/docs"
    fi
fi

if [ -z "$aDocsDir" ] || [ ! -d "$aDocsDir" ]; then
    echo "Error: Cannot find 'docs' directory." >&2
    exit 1
fi

# Step 1: Find the first folder in ./docs/ matching a<NN>* or a<NN>_*
aTargetFolder=""
# Search first for exact folder prefix like a02_ or a02-
for d in "$aDocsDir"/a"${aNN}"_* "$aDocsDir"/a"${aNN}"-* "$aDocsDir"/a"${aNN}"*; do
    if [ -d "$d" ]; then
        aTargetFolder="$d"
        break
    fi
done

if [ -z "$aTargetFolder" ] || [ ! -d "$aTargetFolder" ]; then
    echo "Error: No matching folder for 'a${aNN}*' found in '$aDocsDir'." >&2
    exit 1
fi

echo "=============================================================================="
echo "Target App Number : $aNN (Prefix: ${aTargetPrefix})"
echo "Target Directory  : $aTargetFolder"
if [ "$bDryRun" -eq 1 ]; then
    echo "Mode              : DRY RUN (no files will be changed)"
fi
echo "=============================================================================="

# Helper function to rename (git mv if tracked, else mv)
rename_item() {
    local src="$1"
    local dst="$2"
    local item_type="$3"

    if [ "$src" = "$dst" ]; then
        return 0
    fi

    if [ -e "$dst" ]; then
        echo "Warning: Destination already exists, skipping: $dst" >&2
        return 0
    fi

    if [ "$bDryRun" -eq 1 ]; then
        echo "[DRY-RUN] Would rename $item_type: $(basename "$src") -> $(basename "$dst")"
        return 0
    fi

    if git ls-files --error-unmatch "$src" >/dev/null 2>&1; then
        git mv "$src" "$dst"
        echo "Renamed $item_type (git): $(basename "$src") -> $(basename "$dst")"
    else
        mv "$src" "$dst"
        echo "Renamed $item_type: $(basename "$src") -> $(basename "$dst")"
    fi
}

nFilesRenamed=0
nDirsRenamed=0

# Step 2: Loop through all files recursively in the folder
# Match basenames starting with a[0-9]{2}[-_] or a##[-_]
while IFS= read -r -d '' filePath; do
    dirName="$(dirname "$filePath")"
    baseName="$(basename "$filePath")"

    if [[ "$baseName" =~ ^a([0-9]{2}|##)([-_].*)$ ]]; then
        delimAndRest="${BASH_REMATCH[2]}"
        newBaseName="${aTargetPrefix}${delimAndRest}"
        newFilePath="${dirName}/${newBaseName}"

        if [ "$baseName" != "$newBaseName" ]; then
            rename_item "$filePath" "$newFilePath" "file"
            nFilesRenamed=$((nFilesRenamed + 1))
        fi
    fi
done < <(find "$aTargetFolder" -type f -print0)

# Step 2b: Also rename any matching subdirectories (bottom-up using -depth)
while IFS= read -r -d '' dirPath; do
    parentDir="$(dirname "$dirPath")"
    baseName="$(basename "$dirPath")"

    if [[ "$baseName" =~ ^a([0-9]{2}|##)([-_].*)$ ]]; then
        delimAndRest="${BASH_REMATCH[2]}"
        newBaseName="${aTargetPrefix}${delimAndRest}"
        newDirPath="${parentDir}/${newBaseName}"

        if [ "$baseName" != "$newBaseName" ]; then
            rename_item "$dirPath" "$newDirPath" "directory"
            nDirsRenamed=$((nDirsRenamed + 1))
        fi
    fi
done < <(find "$aTargetFolder" -depth -mindepth 1 -type d -print0)

echo "=============================================================================="
echo "Complete. Files renamed: $nFilesRenamed | Directories renamed: $nDirsRenamed"
echo "=============================================================================="
