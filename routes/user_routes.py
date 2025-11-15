from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import os
import hashlib
from dotenv import load_dotenv

# Try to import bcrypt, fallback to hashlib if not available
try:
    import bcrypt
    USE_BCRYPT = True
except ImportError:
    USE_BCRYPT = False

load_dotenv()

user_bp = Blueprint('user', __name__)

# Set up MongoDB connection
# Allow invalid certificates for development (Windows SSL issue)
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
db = client["haas_db"]
users = db["users"]


def hash_password(password):
    """Hash password using bcrypt if available, otherwise use SHA256"""
    password_bytes = password.encode('utf-8')
    if USE_BCRYPT:
        return bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    else:
        return hashlib.sha256(password_bytes).hexdigest().encode('utf-8')


def check_password(password, hashed):
    """Check password against hash"""
    password_bytes = password.encode('utf-8')
    if USE_BCRYPT:
        return bcrypt.checkpw(password_bytes, hashed)
    else:
        return hashlib.sha256(password_bytes).hexdigest().encode('utf-8') == hashed


@user_bp.route("/test", methods=["POST"])
def test(): 
    return jsonify({"message": "the intial testing works"})

@user_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    hashed = hash_password(password)
    users.insert_one({"username": username, "password": hashed})
    return jsonify({"message": "User created successfully"}), 201


@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    user = users.find_one({"username": username})
    
    if user and check_password(password, user["password"]):
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401
