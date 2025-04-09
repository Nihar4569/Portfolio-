import os

# Get the current working directory
directory = os.getcwd()

# List all files in the directory and filter out directories
files = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]

# Sort files to ensure consistency
files = sorted(files)

# Loop over the files and rename them
for i, file in enumerate(files):
    # Skip .py files
    if file.endswith('.py'):
        print(f"Skipped: {file} is a Python file.")
        continue
    
    # Generate the new filename with .jpg extension
    new_name = f"photo{i + 1}.jpg"
    
    # Get the full path for old and new names
    old_path = os.path.join(directory, file)
    new_path = os.path.join(directory, new_name)
    
    # Check if the new file name already exists
    if not os.path.exists(new_path):
        # Rename the file
        os.rename(old_path, new_path)
        print(f"Renamed: {file} -> {new_name}")
    else:
        print(f"Skipped: {new_name} already exists.")

print("Renaming complete.")
