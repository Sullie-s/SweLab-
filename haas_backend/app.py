import sys
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

# Add parent directory to path so we can import routes
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from routes.user_routes import user_bp
from routes.project_routes import project_bp
from routes.hardware_routes import hardware_bp

app = Flask(__name__) #create the flask app, passing in name 
CORS(app)


app.register_blueprint(user_bp, url_prefix = "/api/users")
app.register_blueprint(project_bp, url_prefix = "/api/projects")
app.register_blueprint(hardware_bp, url_prefix = "/api/hardware")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)