import os

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
print(f"Script directory: {script_dir}")

# Define the expected path to the 'templates' folder
templates_path = os.path.join(script_dir, 'templates')
print(f"Checking for templates folder at: {templates_path}")

# Check if the 'templates' folder exists
if os.path.exists(templates_path):
    print("SUCCESS: 'templates' folder found!")
    # If found, try to list its contents and check for index.html
    print("Contents of 'templates' folder:")
    for item in os.listdir(templates_path):
        print(f"  - {item}")
    
    index_html_path = os.path.join(templates_path, 'index.html')
    print(f"Checking for index.html at: {index_html_path}")
    if os.path.exists(index_html_path):
        print("SUCCESS: 'index.html' found inside 'templates'!")
    else:
        print("FAILURE: 'index.html' NOT found inside 'templates'.")
else:
    print("FAILURE: 'templates' folder NOT found.")

# Define the expected path to the 'static' folder
static_path = os.path.join(script_dir, 'static')
print(f"Checking for static folder at: {static_path}")

# Check if the 'static' folder exists
if os.path.exists(static_path):
    print("SUCCESS: 'static' folder found!")
else:
    print("FAILURE: 'static' folder NOT found.")

print("\n--- End of path check ---")
