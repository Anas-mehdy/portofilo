import json
import os

transcript_path = r"C:\Users\anasm\.gemini\antigravity\brain\e14a31f4-8e17-4a5f-aae6-c050528f465e\.system_generated\logs\transcript_full.jsonl"

with open(transcript_path, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if '"type":"USER_INPUT"' in line and "Dubai CRM" in line:
            data = json.loads(line, strict=False)
            content = data["content"]
            print("Content length:", len(content))
            print("Last 500 characters of content:")
            print(content[-500:])
            break
