# app.py
import os
from flask import Flask, send_from_directory

app = Flask(__name__)

# Route for the homepage
@app.route('/')
def index():
    """
    Serves the index.html file directly from the application's root directory.
    """
    return send_from_directory(app.root_path, 'index.html')


# Route for serving static files (CSS, JS, images, videos)
# This assumes 'static' is in the app's root directory.
@app.route('/static/<path:filename>')
def static_files(filename):
    """
    Serves static files from the 'static' directory.
    """
    return send_from_directory(os.path.join(app.root_path, 'static'), filename)


if __name__ == '__main__':
    # Run the Flask application in debug mode for local development.
    app.run(debug=True)

