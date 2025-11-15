from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

project_bp = Blueprint('project', __name__)

# Set up MongoDB connection with SSL fix for Windows
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
db = client["haas_db"]
projects = db["project"]

@project_bp.route("/test", methods=["POST"])
def test(): 
    return jsonify({"message": "the intial testing works"})

@project_bp.route("/create", methods = ["POST"])
def create_project():
    data = request.get_json()
    newProject = {
        "project_name" : data["project_name"], 
        "project_desc" : data["project_desc"], 
        "project_id" : data["project_id"],
        "resources_reqeusted" : []
    }

    projects.insert_one(newProject)

    return jsonify({"message": "Project created sucessfully"}), 201

@project_bp.route("/list", methods = ["GET"])
def get_projects():
    from bson import ObjectId
    all_projects = list(projects.find())
    for proj in all_projects: 
        # Convert ObjectId to string for JSON serialization
        proj["_id"] = str(proj["_id"])
        proj["project_id"] = str(proj["project_id"])
    return jsonify(all_projects)
