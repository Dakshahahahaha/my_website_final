# app.py
import os
from flask import Flask, render_template, send_from_directory
from jinja2 import FileSystemLoader, Environment

# Initialize Flask app.
# By default, Flask looks for a 'templates' folder relative to the app.py location.
# If templates are in the root (same as app.py), you don't need template_folder.
app = Flask(__name__) # Removed template_folder='views'

# Manually configure Jinja2 Environment to look for templates in the current directory
# This makes it look in the same folder as app.py
current_dir = os.path.dirname(os.path.abspath(__file__))
jinja_loader = FileSystemLoader(current_dir) # Pointing to current directory
app.jinja_env = Environment(loader=jinja_loader)

# Route for the homepage
@app.route('/')
def index():
    """
    Renders the main index.html page.
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
@app.route('/static/<path:filename>')
def static_files(filename):
    """
    Serves static files from the 'static' directory.
    This assumes 'static' is also in the app's root directory.
    """
    return send_from_directory(os.path.join(current_dir, 'static'), filename)

if __name__ == '__main__':
    # Run the Flask application in debug mode for local development.
    app.run(debug=True)

