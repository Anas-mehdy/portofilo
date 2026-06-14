import json
import re
import os

transcript_path = r"C:\Users\anasm\.gemini\antigravity\brain\e14a31f4-8e17-4a5f-aae6-c050528f465e\.system_generated\logs\transcript_full.jsonl"

with open(transcript_path, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if '"type":"USER_INPUT"' in line and "Dubai CRM" in line:
            data = json.loads(line, strict=False)
            content = data["content"]
            print("Content length:", len(content))
            match = re.search(r"const defaultProjects\s*=\s*\[", content)
            if match:
                print("Found match at:", match.start())
                # Let's count brackets manually and print counts
                brackets = []
                for i in range(match.end() - 1, len(content)):
                    if content[i] == '[':
                        brackets.append(('[', i))
                    elif content[i] == ']':
                        if brackets:
                            brackets.pop()
                            if not brackets:
                                print("Matched closing bracket at:", i)
                                break
                        else:
                            print("Extra closing bracket at:", i)
                print("Remaining open brackets:", len(brackets))
                if brackets:
                    print("Last open bracket at:", brackets[-1])
            else:
                print("No match found")
