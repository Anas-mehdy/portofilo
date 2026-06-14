import json
import re

msg_path = r"C:\Users\anasm\.gemini\antigravity\brain\e14a31f4-8e17-4a5f-aae6-c050528f465e\scratch\temp_user_msg.json"
projects_path = r"c:\Users\anasm\OneDrive\Desktop\claude\portofilio\js\projects.js"

with open(msg_path, 'r', encoding='utf-8-sig') as f:
    raw_content = f.read()

# Load JSON with strict=False to allow control characters (tabs, newlines)
data = json.loads(raw_content, strict=False)
content = data["content"]

# Find the start of the JS array declaration
match = re.search(r"const defaultProjects\s*=\s*\[", content)
if not match:
    match = re.search(r"defaultProjects\s*=\s*\[", content)

if match:
    start_idx = match.end() - 1 # starts at '['
    bracket_count = 0
    end_idx = -1
    for i in range(start_idx, len(content)):
        if content[i] == '[':
            bracket_count += 1
        elif content[i] == ']':
            bracket_count -= 1
            if bracket_count == 0:
                end_idx = i + 1
                break
                
    if end_idx != -1:
        array_str = content[start_idx:end_idx]
        print("Successfully extracted array string of length:", len(array_str))
        
        # Read the current projects.js file
        with open(projects_path, 'r', encoding='utf-8') as f:
            projects_content = f.read()
            
        proj_match = re.search(r"const defaultProjects\s*=\s*\[", projects_content)
        if proj_match:
            proj_start = proj_match.start()
            proj_bracket_count = 0
            proj_end = -1
            for j in range(proj_match.end() - 1, len(projects_content)):
                if projects_content[j] == '[':
                    proj_bracket_count += 1
                elif projects_content[j] == ']':
                    proj_bracket_count -= 1
                    if proj_bracket_count == 0:
                        proj_end = j + 1
                        break
                        
            if proj_end != -1:
                # Replace the old array with the new array
                new_projects_content = projects_content[:proj_start] + "const defaultProjects = " + array_str + projects_content[proj_end:]
                
                with open(projects_path, 'w', encoding='utf-8') as f:
                    f.write(new_projects_content)
                print("Successfully updated projects.js!")
            else:
                print("Error: Could not find matching closing bracket in projects.js")
        else:
            print("Error: Could not find const defaultProjects in projects.js")
    else:
        print("Error: Could not find matching closing bracket in content")
else:
    print("Error: Could not find defaultProjects array in content")
