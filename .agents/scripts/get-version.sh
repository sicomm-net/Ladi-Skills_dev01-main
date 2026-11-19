#!/bin/bash
# ==============================================================================
# Script: get-version.sh
# Purpose: Generate or retrieve a date-based version string: <aTS>.<aNN>
#          aTS = 5-digit date string (e.g. 60911 from %y%m%d with leading character removed)
#          aNN = 2-digit sequence number
#
# Usage:
#   ./get-version.sh [aNN] [target]
#
# Arguments:
#   $1 (aNN):    Optional explicit sequence number (e.g. "01", "04"),
#                or "next" / "+1" to auto-increment git sequence.
#   $2 (target): Optional source to detect the latest aNN from:
#                - "git": search git commit messages from today
#                - folder path: search file names in that folder (default: ".")
#
# Behavior:
#   - File matching (target != "git"): Always auto-increments to the next version number.
#     If no matching files found, defaults to 01 (00 + 1).
#   - Git matching (target == "git"): Returns the latest commit sequence today.
#     Auto-increments to next sequence if "next" / "+1" is passed.
#   - Explicit number (e.g. "05"): Uses the specified number directly.
#
# Examples:
#   ./get-version.sh               -> Searches current folder (.), returns next NN (e.g. <aTS>.03)
#   ./get-version.sh <folder>      -> Searches <folder>, returns next NN
#   ./get-version.sh git           -> Searches git commits today, returns latest NN (e.g. <aTS>.03)
#   ./get-version.sh next git      -> Gets latest git commit NN today + 1 (e.g. <aTS>.04)
#   ./get-version.sh git next      -> Gets latest git commit NN today + 1
#   ./get-version.sh 05            -> Explicit NN: returns <aTS>.05
# ==============================================================================

# Calculate 5-digit date string (YYMMDD with leading character removed -> YMMDD)
aTS="$(date +%y%m%d)"
aTS="${aTS:1}"

aNN="$1"
aTarget="$2"
bIncrement=0

# Handle "next" / "+1" / "--next" / "-n" flag in either argument position
if [ "$aNN" = "next" ] || [ "$aNN" = "+1" ] || [ "$aNN" = "--next" ] || [ "$aNN" = "-n" ]; then
    bIncrement=1
    aNN=""
elif [ "$aTarget" = "next" ] || [ "$aTarget" = "+1" ] || [ "$aTarget" = "--next" ] || [ "$aTarget" = "-n" ]; then
    bIncrement=1
    aTarget=""
fi

# Convenience: If $1 is 'git' or a non-numeric string (e.g. folder path) and $aTarget is empty,
# treat $1 as the target instead of aNN
if [ "$aNN" = "git" ]; then
    aTarget="git"
    aNN=""
elif [ -n "$aNN" ] && ! [[ "$aNN" =~ ^[0-9]+$ ]] && [ -z "$aTarget" ]; then
    aTarget="$aNN"
    aNN=""
fi

# If aNN is not provided (or was a target/flag), look up existing version
if [ -z "$aNN" ]; then
    if [ "$aTarget" = "git" ]; then
        # Search git log for commits matching ${aTS}.<NN> (e.g. .(60911.03_... or 60911.03)
        # git log lists newest first, so head -n 1 gets the latest commit prefix today
        aNN=$(git log --format="%s" 2>/dev/null | grep -o -E "${aTS}\.[0-9]+" | head -n 1 | cut -d'.' -f2)

        # Default to 00 if no match was found
        if [ -z "$aNN" ]; then
            aNN="00"
        fi

        # Auto-increment if requested
        if [ "$bIncrement" -eq 1 ]; then
            nVal=$(( 10#$aNN + 1 ))
            printf -v aNN "%02d" "$nVal"
        fi
    else
        # Search folder for files matching ${aTS}[._-]<NN> (prefix, suffix, or embedded)
        # File matching ALWAYS returns the next version number (auto-increment by default)
        aDir="${aTarget:-.}"
        if [ -e "$aDir" ]; then
            aNN=$(find "$aDir" -type f ! -path '*/.git/*' ! -path '*/node_modules/*' 2>/dev/null \
                | sed 's|.*/||' \
                | grep -o -E "[0-9][0-9][0-9][0-9][0-9][._-][0-9]+" \
                | sed  -E "s/^[0-9][0-9][0-9][0-9][._-]//" \
                | sort -V \
                | tail -n 1)

            if [[ "$aNN" =~ ^[0-9][0-9][0-9][0-9][0-9] ]]; then
                # Convert to decimal to remove leading zeros, then re-pad to 2 digits
                aTS=${aNN:0:5}; aNN="${aNN:6}"
            fi
    
        fi
#               | grep -o -E "${aTS}[._-][0-9]+" \
#               | sed  -E "s/^${aTS}[._-]//" \

        # Default to 00 if no match was found (will increment to 01)
        if [ -z "$aNN" ]; then
            aNN="00"
        fi

        # Always return the next version number for file matching
        nVal=$(( 10#$aNN + 1 ))
        printf -v aNN "%02d" "$nVal"
    fi
else
    # Pad single-digit number to 2 digits if purely numeric
    if [[ "$aNN" =~ ^[0-9]$ ]]; then
        aNN="0$aNN"
    fi
fi

echo "${aTS}.${aNN}"
