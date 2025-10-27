from flask import Flask, jsonify, reqeust
from flask_cors import CORS
from routes.user_routes import user_bp
from routes.project_routes import project_bp
from routes.hardware_routes import hardware_bp

app = Flask(__name__) #create the flask app, passing in name 
CORS(app)


app.register_blueprint(user_bp, url_prefix = "/api/users")
app.register_blueprint(project_bp, user_prefix = "/api/projects")
app.register_blueprint(hardware_bp, url_prefix = "/api/hardware")

if __name__ == "__main__":
    app.run(debug=True)