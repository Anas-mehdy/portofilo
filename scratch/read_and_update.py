import os
import re

workspace_dir = r"c:\Users\anasm\OneDrive\Desktop\claude\portofilio"
temp_file_path = os.path.join(workspace_dir, "projects_temp.txt")
projects_js_path = os.path.join(workspace_dir, "js", "projects.js")

if not os.path.exists(temp_file_path):
    # Try .json extension
    temp_file_path = os.path.join(workspace_dir, "projects_temp.json")
    if not os.path.exists(temp_file_path):
        print("Error: Could not find projects_temp.txt or projects_temp.json in workspace.")
        exit(1)

print("Found temporary file at:", temp_file_path)
with open(temp_file_path, 'r', encoding='utf-8') as f:
    temp_content = f.read()

# Extract the array from the temp file content
# It might start with "const defaultProjects = [" or just "["
match = re.search(r"const defaultProjects\s*=\s*\[", temp_content)
if not match:
    match = re.search(r"defaultProjects\s*=\s*\[", temp_content)
    
if match:
    start_idx = match.end() - 1 # index of '['
else:
    # Try finding the first '[' in the file
    start_idx = temp_content.find('[')
    if start_idx == -1:
        print("Error: Could not find start of array '[' in temporary file.")
        exit(1)

# Count brackets to extract the exact array
bracket_count = 0
end_idx = -1
for i in range(start_idx, len(temp_content)):
    if temp_content[i] == '[':
        bracket_count += 1
    elif temp_content[i] == ']':
        bracket_count -= 1
        if bracket_count == 0:
            end_idx = i + 1
            break

if end_idx == -1:
    print("Error: Could not find matching closing bracket ']' in temporary file.")
    exit(1)

array_str = temp_content[start_idx:end_idx]
print("Extracted array string of length:", len(array_str))

# Now, read projects.js
with open(projects_js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Locate const defaultProjects = [ in projects.js
proj_match = re.search(r"const defaultProjects\s*=\s*\[", js_content)
if not proj_match:
    print("Error: Could not find 'const defaultProjects = [' in js/projects.js")
    exit(1)

proj_start = proj_match.start()
proj_bracket_count = 0
proj_end = -1
for j in range(proj_match.end() - 1, len(js_content)):
    if js_content[j] == '[':
        proj_bracket_count += 1
    elif js_content[j] == ']':
        proj_bracket_count -= 1
        if proj_bracket_count == 0:
            proj_end = j + 1
            break

if proj_end == -1:
    print("Error: Could not find matching closing bracket in js/projects.js")
    exit(1)

# Perform replacement
new_js_content = js_content[:proj_start] + "const defaultProjects = " + array_str + js_content[proj_end:]

# Write updated projects.js
with open(projects_js_path, 'w', encoding='utf-8') as f:
    f.write(new_js_content)
    
print("Successfully updated js/projects.js with the complete array!")

# Remove the temporary file to keep the workspace clean
try:
    os.remove(temp_file_path)
    print("Successfully deleted the temporary file:", temp_file_path)
except Exception as e:
    print("Warning: Could not delete temporary file:", e)
