from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv() #loads the environmental variables from the .env

hardware_bp = Blueprint('hardware', __name__)

# Set up MongoDB connection with SSL fix for Windows
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsAllowInvalidCertificates=True)
db = client["haas_db"]
hardware_sets = db["hardware_sets"]

# Initialize hardware sets if they don't exist
def init_hardware_sets():
    if hardware_sets.count_documents({}) == 0:
        hardware_sets.insert_many([
            {"hw_set_id": "HWSet1", "capacity": 10, "available": 10},
            {"hw_set_id": "HWSet2", "capacity": 8, "available": 8}
        ])

# Initialize on module load
init_hardware_sets()

@hardware_bp.route("/test", methods=["POST"])
def test(): 
    return jsonify({"message": "the intial testing works"})

@hardware_bp.route("/status", methods=["GET"])
def get_hardware_status():
    """Get current status of all hardware sets"""
    try:
        hw1 = hardware_sets.find_one({"hw_set_id": "HWSet1"})
        hw2 = hardware_sets.find_one({"hw_set_id": "HWSet2"})
        
        if not hw1 or not hw2:
            init_hardware_sets()
            hw1 = hardware_sets.find_one({"hw_set_id": "HWSet1"})
            hw2 = hardware_sets.find_one({"hw_set_id": "HWSet2"})
        
        return jsonify({
            "HWSet1": {
                "capacity": hw1["capacity"],
                "available": hw1["available"]
            },
            "HWSet2": {
                "capacity": hw2["capacity"],
                "available": hw2["available"]
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@hardware_bp.route("/checkout", methods=["POST"])
def checkout_hardware():
    """Checkout hardware from a hardware set"""
    data = request.get_json()
    hw_set_id = data.get("hw_set_id")  # "HWSet1" or "HWSet2"
    quantity = data.get("quantity", 1)
    project_id = data.get("project_id")
    
    if not hw_set_id or not project_id:
        return jsonify({"error": "hw_set_id and project_id are required"}), 400
    
    if quantity <= 0:
        return jsonify({"error": "Quantity must be greater than 0"}), 400
    
    try:
        hw_set = hardware_sets.find_one({"hw_set_id": hw_set_id})
        if not hw_set:
            return jsonify({"error": f"Hardware set {hw_set_id} not found"}), 404
        
        if hw_set["available"] < quantity:
            return jsonify({"error": f"Insufficient hardware available. Available: {hw_set['available']}"}), 400
        
        # Update available quantity
        new_available = hw_set["available"] - quantity
        hardware_sets.update_one(
            {"hw_set_id": hw_set_id},
            {"$set": {"available": new_available}}
        )
        
        return jsonify({
            "message": f"Checked out {quantity} units of {hw_set_id}",
            "available": new_available
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@hardware_bp.route("/checkin", methods=["POST"])
def checkin_hardware():
    """Check in hardware to a hardware set"""
    data = request.get_json()
    hw_set_id = data.get("hw_set_id")  # "HWSet1" or "HWSet2"
    quantity = data.get("quantity", 1)
    
    if not hw_set_id:
        return jsonify({"error": "hw_set_id is required"}), 400
    
    if quantity <= 0:
        return jsonify({"error": "Quantity must be greater than 0"}), 400
    
    try:
        hw_set = hardware_sets.find_one({"hw_set_id": hw_set_id})
        if not hw_set:
            return jsonify({"error": f"Hardware set {hw_set_id} not found"}), 404
        
        # Calculate how much was checked out
        checked_out = hw_set["capacity"] - hw_set["available"]
        if quantity > checked_out:
            return jsonify({"error": f"Cannot check in more than what was checked out. Checked out: {checked_out}"}), 400
        
        # Update available quantity (can't exceed capacity)
        new_available = min(hw_set["available"] + quantity, hw_set["capacity"])
        hardware_sets.update_one(
            {"hw_set_id": hw_set_id},
            {"$set": {"available": new_available}}
        )
        
        return jsonify({
            "message": f"Checked in {quantity} units of {hw_set_id}",
            "available": new_available
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500