# app.py
import os
from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

# Route for the homepage
@app.route('/')
def index():
    """
    Renders the main index.html page.
    Assumes index.html is directly in the application's root directory.
    """
    # Flask's default template loader will look in a 'templates' folder.
    # To make it look in the current directory (where index.html is now),
    # we tell it the root_path, or use send_from_directory for explicit file.
    # Simpler: just render it and Flask will find it in the root path if specified
    # or if we are serving files from the root.
    # For a direct file in root, `send_from_directory` is explicit.
    return send_from_directory(app.root_path, 'index.html')


# Route for serving static files (CSS, JS, images, videos)
# This assumes 'static' is also in the app's root directory.
@app.route('/static/<path:filename>')
def static_files(filename):
    """
    Serves static files from the 'static' directory.
    """
    return send_from_directory(os.path.join(app.root_path, 'static'), filename)


if __name__ == '__main__':
    # Run the Flask application in debug mode for local development.
    app.run(debug=True)

