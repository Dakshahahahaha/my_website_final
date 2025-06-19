# app.py
import os
from flask import Flask, send_from_directory
from jinja2 import FileSystemLoader, Environment

# Initialize Flask app. We won't set template_folder here as we are doing it manually below.
app = Flask(__name__)

# --- Manual Jinja2 Environment Configuration ---
# Get the absolute path to the directory where app.py is located
current_dir = os.path.dirname(os.path.abspath(__file__))

# Define the path to your 'views' folder relative to app.py
# This is the folder where base.html and index.html should be located
views_folder_path = os.path.join(current_dir, 'views')

# Set up Jinja2 environment to explicitly look for templates in the 'views' folder
jinja_loader = FileSystemLoader(views_folder_path)
app.jinja_env = Environment(loader=jinja_loader)

# Debugging prints (these will show in your terminal)
print(f"Jinja2 is configured to load templates from: {views_folder_path}")
if not os.path.exists(views_folder_path):
    print(f"CRITICAL: The 'views' folder at '{views_folder_path}' does NOT exist for Jinja2.")
else:
    print(f"SUCCESS: The 'views' folder exists at: '{views_folder_path}'")
    # Check if index.html is actually inside the views folder
    index_html_path = os.path.join(views_folder_path, 'index.html')
    if not os.path.exists(index_html_path):
        print(f"CRITICAL: 'index.html' NOT found inside '{views_folder_path}'.")
    else:
        print(f"SUCCESS: 'index.html' is present in '{views_folder_path}'.")
# --- End of Manual Jinja2 Configuration ---


# Route for the homepage
@app.route('/')
def index():
    """
    Renders the main index.html page using the manually configured Jinja2 environment.
    """
    try:
        # Get the template from the manually configured Jinja2 environment
        template = app.jinja_env.get_template('index.html')
        # Render the template
        return template.render()
    except Exception as e:
        # Print the exact error if template rendering fails
        print(f"Error rendering template: {e}")
        # Re-raise the exception so Flask's debugger can catch it and show more details in the browser
        raise

# Route for serving static files (CSS, JS, images, videos)
# This uses the current_dir determined above for consistency
@app.route('/static/<path:filename>')
def static_files(filename):
    """
    Serves static files from the 'static' directory.
    """
    return send_from_directory(os.path.join(current_dir, 'static'), filename)

if __name__ == '__main__':
    # Run the Flask application in debug mode for local development.
    # debug=True allows for automatic reloading on code changes and provides a debugger in the browser.
    app.run(debug=True)

