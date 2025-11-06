#!/bin/bash

# This script scans all review directories and moves any file to its correct
# location based on the STATUS code inside the file.

# --- Configuration ---
# The base directory where the script is located and where the review folders are.
BASE_DIR="."

declare -A DIRS
DIRS[0]="0_raw_notes"
DIRS[1]="1_ai_cleanup"
DIRS[2]="2_3rd_party_check"
DIRS[3]="3_in_review"
DIRS[4]="4_approved"
DIRS[5]="5_merged"

# --- Script Logic ---

MOVED_COUNT=0

echo "Starting organization process..."

# Loop through each of the defined status directories
for DIR_CODE in "${!DIRS[@]}"; do
  CURRENT_DIR_NAME=${DIRS[$DIR_CODE]}
  CURRENT_PATH="$BASE_DIR/$CURRENT_DIR_NAME"

  # Check if the directory exists, skip if not
  if [ ! -d "$CURRENT_PATH" ]; then
    continue
  fi

  # Find all markdown files in the current directory
  find "$CURRENT_PATH" -name "*.md" -print0 | while IFS= read -r -d $'\0' FILE_PATH; do
    # Read the status from the first line of the file
    STATUS_LINE=$(head -n 1 "$FILE_PATH")
    STATUS=

    # Extract the number from the status line
    if [[ "$STATUS_LINE" =~ ^[0-9]+$ ]]; then
      STATUS=$STATUS_LINE
    elif [[ "$STATUS_LINE" =~ STATUS:[[:space:]]*([0-9]+) ]]; then
      STATUS=${BASH_REMATCH[1]}
    else
      # Try to read just a number if the header is not present
      STATUS=$(echo "$STATUS_LINE" | grep -oE '[0-9]+')
      if [ -z "$STATUS" ]; then
        echo "Warning: Could not find a status in '$FILE_PATH'. Skipping."
        continue
      fi
    fi

    # Get the correct destination directory name for the status found in the file
    DEST_DIR_NAME=${DIRS[$STATUS]}

    # Check if the status is valid
    if [ -z "$DEST_DIR_NAME" ]; then
      echo "Warning: File '$FILE_PATH' has invalid status '$STATUS'. Skipping."
      continue
    fi

    # If the current directory is not the correct one, move the file
    if [ "$CURRENT_DIR_NAME" != "$DEST_DIR_NAME" ]; then
      DEST_PATH="$BASE_DIR/$DEST_DIR_NAME"
      FILENAME=$(basename "$FILE_PATH")

      if [ ! -d "$DEST_PATH" ]; then
        echo "Warning: Destination directory '$DEST_PATH' does not exist. Skipping move for '$FILENAME'."
        continue
      fi

      mv "$FILE_PATH" "$DEST_PATH/$FILENAME"
      echo "Moved '$FILENAME' from '$CURRENT_DIR_NAME' to '$DEST_DIR_NAME'"
      ((MOVED_COUNT++))
    fi
  done
done

if [ "$MOVED_COUNT" -eq 0 ]; then
  echo "No files needed to be moved. Everything is organized."
else
  echo "Organization complete. Moved $MOVED_COUNT file(s)."
fi

exit 0