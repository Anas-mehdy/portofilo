projects_js_path = r"c:\Users\anasm\OneDrive\Desktop\claude\portofilio\js\projects.js"

with open(projects_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Print the last 1000 characters
print("Last 1000 characters of projects.js:")
print(content[-1000:])
