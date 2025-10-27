from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

user_bp = Blueprint('user', __name__)

# Set up MongoDB connection
client = MongoClient(os.getenv("MONGO_URI"))
db = client["haas_db"]
users = db["users"]


@user_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data["username"]
    password = data["password"].encode('utf-8')
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    users.insert_one({"username": username, "password": hashed})
    return jsonify({"message": "User created successfully"}), 201


@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data["username"]
    password = data["password"].encode('utf-8')
    user = users.find_one({"username": username})
    
    if user and bcrypt.checkpw(password, user["password"]):
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401
