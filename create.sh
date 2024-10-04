#!/bin/bash

# This script generates recreate_files.sh to recreate the project structure and contents

# Define the name of the output script file
OUTPUT_SCRIPT="recreate_files.sh"

# Create the output script and add the shebang
echo "#!/bin/bash" > "$OUTPUT_SCRIPT"
echo "# This script will recreate the entire project structure and contents" >> "$OUTPUT_SCRIPT"
echo "" >> "$OUTPUT_SCRIPT"

# Get the absolute path of the current directory (root directory)
ROOT_DIR=$(pwd)

# Traverse through all files and directories, ignoring node_modules and other specified directories/files
find "$ROOT_DIR" -type d -name "node_modules" -prune -o \
     -name ".git" -prune -o \
     -name "*.lock" -prune -o \
     -name "*.log" -prune -o \
     -name "*.tsbuildinfo" -prune -o \
     -type f -print | while read FILE; do

  # Get the relative path of the file or directory from the root directory
  RELATIVE_PATH=$(realpath --relative-to="$ROOT_DIR" "$FILE")

  # Ensure paths use escaped spaces
  ESCAPED_PATH=$(echo "$RELATIVE_PATH" | sed 's| |\\ |g')

  # Check if it's a directory or file
  if [ -d "$FILE" ]; then
    # Write the mkdir command to create the directory
    echo "mkdir -p \"$ESCAPED_PATH\"" >> "$OUTPUT_SCRIPT"
    echo "echo \"Directory created: $ESCAPED_PATH\"" >> "$OUTPUT_SCRIPT"
  elif [ -f "$FILE" ]; then
    # Write the touch command to create the file
    echo "mkdir -p \"\$(dirname \"$ESCAPED_PATH\")\"" >> "$OUTPUT_SCRIPT"
    echo "touch \"$ESCAPED_PATH\"" >> "$OUTPUT_SCRIPT"
    echo "echo \"File created: $ESCAPED_PATH\"" >> "$OUTPUT_SCRIPT"

    # Write the file content to the output script
    echo "cat << 'EOF' > \"$ESCAPED_PATH\"" >> "$OUTPUT_SCRIPT"
    sed 's/$/\\n/' "$FILE" >> "$OUTPUT_SCRIPT"  # Append the actual file contents, escaping new lines
    echo "EOF" >> "$OUTPUT_SCRIPT"
    echo "echo \"File content added: $ESCAPED_PATH\"" >> "$OUTPUT_SCRIPT"
  fi
done

# Make the output script executable
chmod +x "$OUTPUT_SCRIPT"

echo "Script '$OUTPUT_SCRIPT' has been generated."
