from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv() #loads the environmental variables from the .env

hardware_bp = Blueprint('hardware', __name__)

client = MongoClient(os.getenv("MONGO_URI")) #subject to change
db = client["haas_db"] #subject to change 
hardware = db["hardware"]


@hardware_bp.route("/checkout", methods=["POST"])
def checkout_resource():
    data = request.get_json()
    project_id = data["project_id"]
    resource_id = data["resource_id"]

    hardware.update_one({"resource_id": resource_id}, 
                        {"$set": {"status": "checked-out", "project_id": project_id}})
    
    return jsonify({"message": "Resource checked out sucessfully"}), 200


@hardware_bp.route("/checkin", methods = ["POST"])
def checkin_resource():
    data = request.get_json()
    resource_id = data["resource_id"] # get the id of the resource checked out 

    hardware.update_one({"resource_id": resource_id}, 
                        {"$set" : {"status": "checked-in", "project_id": None}})
    
    return jsonify({"message": "Resource checked in sucessfully"}), 200