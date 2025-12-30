from flask import Blueprint, jsonify

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/test", methods=["GET"])
def test_reports():
    return jsonify({"message": "Reports route working"})
