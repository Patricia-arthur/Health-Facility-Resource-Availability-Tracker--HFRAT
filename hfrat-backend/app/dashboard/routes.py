from flask import Blueprint, jsonify

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/test", methods=["GET"])
def test_dashboard():
    return jsonify({"message": "Dashboard route working"})
