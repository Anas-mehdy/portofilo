projects_js_path = r"c:\Users\anasm\OneDrive\Desktop\claude\portofilio\js\projects.js"

with open(projects_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target functions to replace
target_text = """// Load projects from localStorage or use defaults
function getProjects() {
  const stored = localStorage.getItem("automation_projects");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored projects, reverting to default", e);
      return defaultProjects;
    }
  }
  // If not in storage, set default
  saveProjects(defaultProjects);
  return defaultProjects;
}

// Save projects to localStorage
function saveProjects(projects) {
  localStorage.setItem("automation_projects", JSON.stringify(projects));
}

// Reset projects to defaults
function resetProjects() {
  saveProjects(defaultProjects);
  return defaultProjects;
}"""

replacement_text = """// Load projects from localStorage or use defaults
function getProjects() {
  const isEdited = localStorage.getItem("automation_projects_edited") === "true";
  const stored = localStorage.getItem("automation_projects");
  if (isEdited && stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored projects, reverting to default", e);
      return defaultProjects;
    }
  }
  return defaultProjects;
}

// Save projects to localStorage
function saveProjects(projects) {
  localStorage.setItem("automation_projects", JSON.stringify(projects));
  localStorage.setItem("automation_projects_edited", "true");
}

// Reset projects to defaults
function resetProjects() {
  localStorage.removeItem("automation_projects");
  localStorage.removeItem("automation_projects_edited");
  return defaultProjects;
}"""

if target_text in content:
    new_content = content.replace(target_text, replacement_text)
    with open(projects_js_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated js/projects.js sync logic!")
else:
    # Try fuzzy matching in case of formatting differences
    print("Error: Target text not found exactly in projects.js. Doing manual regex replace...")
    # Let's search for function definitions using regex
    pattern = r"// Load projects from localStorage or use defaults[\s\S]+?return defaultProjects;\s*\}"
    content_new = re.sub(pattern, replacement_text, content)
    if content_new != content:
        with open(projects_js_path, 'w', encoding='utf-8') as f:
            f.write(content_new)
        print("Successfully updated js/projects.js sync logic using regex!")
    else:
        print("Error: Could not perform regex replacement either.")
