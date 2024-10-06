#!/bin/bash

# Function to convert directory names to kebab-case
convert_dirs_to_kebab_case() {
  find "$1" -depth -type d -not -path '*/\.*' | while read -r dir; do
    base_dir=$(dirname "$dir")
    dir_name=$(basename "$dir")
    kebab_dir_name=$(echo "$dir_name" | tr '[:upper:]' '[:lower:]' | sed 's/[ _]/-/g' | tr -s '-')
    if [ "$dir_name" != "$kebab_dir_name" ]; then
      mv "$dir" "$base_dir/$kebab_dir_name"
      echo "Renamed directory: $dir -> $base_dir/$kebab_dir_name"
    fi
  done
}

# Function to convert filenames in components to PascalCase
convert_files_to_pascal_case() {
  find "$1" -type f -name '*.tsx' -not -path '*/\.*' | while read -r file; do
    dir=$(dirname "$file")
    filename=$(basename "$file")
    filename_no_ext="${filename%.*}"
    ext="${filename##*.}"

    # Convert to PascalCase
    pascal_case_filename=$(echo "$filename_no_ext" | sed -r 's/(^|_|-)([a-z])/\U\2/g')
    pascal_case_filename="${pascal_case_filename}.${ext}"

    if [ "$filename" != "$pascal_case_filename" ]; then
      mv "$file" "$dir/$pascal_case_filename"
      echo "Renamed file: $file -> $dir/$pascal_case_filename"
    fi
  done
}

# Function to delete unnecessary files
delete_unnecessary_files() {
  echo "Deleting unnecessary files..."
  files_to_delete=(
    "findme_deleteme.txt"
    "outputviewtree.txt"
    "server.log"
    "finished.txt"
    "todos.txt"
    "todos_checklist"
    "runopendev copy.sh"
    "*.py"
  )
  for pattern in "${files_to_delete[@]}"; do
    find . -type f -name "$pattern" -not -path '*/\.*' -exec rm -v {} \;
  done
}

# Function to find potentially duplicate files
find_duplicates() {
  echo "Potentially duplicate files:"
  find src -type f -printf "%f\n" | sort | uniq -d
}

echo "Starting clean up..."

# Delete unnecessary files in the project root
delete_unnecessary_files

# Convert directory names in src/app to kebab-case
convert_dirs_to_kebab_case "src/app"

# Convert component filenames in src/components to PascalCase
convert_files_to_pascal_case "src/components"

# Convert filenames in src/app excluding page.tsx and layout.tsx to kebab-case
find src/app -type f -name '*.tsx' -not -name 'page.tsx' -not -name 'layout.tsx' -not -path '*/\.*' | while read -r file; do
  dir=$(dirname "$file")
  filename=$(basename "$file")
  filename_no_ext="${filename%.*}"
  kebab_case_filename=$(echo "$filename_no_ext" | tr '[:upper:]' '[:lower:]' | sed 's/[ _]/-/g' | tr -s '-')
  kebab_case_filename="${kebab_case_filename}.tsx"
  if [ "$filename" != "$kebab_case_filename" ]; then
    mv "$file" "$dir/$kebab_case_filename"
    echo "Renamed file: $file -> $dir/$kebab_case_filename"
  fi
done

# Remove duplicate files (manual review required)
echo
echo "Finding potentially duplicate files..."
find_duplicates

echo "Clean up completed."
