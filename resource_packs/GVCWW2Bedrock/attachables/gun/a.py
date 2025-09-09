import json
import os
#read all file with all sub directory .json file
directory = './' 
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.json'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    data["minecraft:attachable"]["description"]["materials"]["default"] = "iron_golem"
                    with open(file_path, 'w', encoding='utf-8') as f:
                        json.dump(data, f, ensure_ascii=False, indent=4)

                except json.JSONDecodeError as e:
                    print(f"Error decoding JSON from {file_path}: {e}")