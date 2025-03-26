import os
import json

# === CONFIG ===
SRC_DIR = r"C:\Users\User\Documents\YEAR3DURHAMCOLLEGE\Semester6\INFT-3201-03-DatabaseDevelopment2\Aunt-Rosie-Project\aunt-rosie-project\src"
OUTPUT_JSON = "code_snapshot.json"
INCLUDE_EXTENSIONS = {".js", ".jsx", ".ts", ".tsx", ".css", ".json"} 

def get_file_tree(directory):
    snapshot = {}

    for root, _, files in os.walk(directory):
        for file in files:
            if os.path.splitext(file)[1].lower() in INCLUDE_EXTENSIONS:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, directory)
                with open(abs_path, "r", encoding="utf-8", errors="ignore") as f:
                    try:
                        content = f.read()
                    except Exception as e:
                        content = f"ERROR: {str(e)}"
                snapshot[rel_path.replace("\\", "/")] = content

    return snapshot

def save_snapshot(snapshot, output_path):
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, indent=2)

if __name__ == "__main__":
    print(f"Scanning: {SRC_DIR}")
    snapshot = get_file_tree(SRC_DIR)
    print(f"Found {len(snapshot)} files.")
    save_snapshot(snapshot, OUTPUT_JSON)
    print(f"Snapshot saved to: {OUTPUT_JSON}")
