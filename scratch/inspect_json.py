import os
import json
msg_path = r"C:\Users\anasm\OneDrive\Desktop\claude\portofilio\scratch\temp_user_msg.json"
if not os.path.exists(msg_path):
    msg_path = r"C:\Users\anasm\.gemini\antigravity\brain\e14a31f4-8e17-4a5f-aae6-c050528f465e\scratch\temp_user_msg.json"

with open(msg_path, 'r', encoding='utf-8-sig') as f:
    raw = f.read()

data = json.loads(raw, strict=False)
print("Keys:", list(data.keys()))
if "content" in data:
    print("Content length:", len(data["content"]))
    print("First 100 chars of content:", data["content"][:100])
else:
    print("No content key!")
    for k, v in data.items():
        print(f"Key: {k}, type: {type(v)}")
