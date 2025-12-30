from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.extensions import db
from app.models import ResourceReport, User


reports_bp = Blueprint("reports", __name__)



#@reports_bp.route("/test", methods=["GET"])
#def test_reports():
 #   return jsonify({"message": "Reports route working"})

@reports_bp.route("/submit", methods=["POST"])
@jwt_required()
def submit_report():
    user_id = int(get_jwt_identity())
    role = get_jwt()["role"]

    if role != "REPORTER":
        return jsonify({"error": "Access denied"}), 403

    user = User.query.get(user_id)
    data = request.get_json()

    report = ResourceReport(
        facility_id=user.facility_id,
        reporter_id=user_id,
        icu_beds_available=data.get("icu_beds_available"),
        incubators=data.get("incubators"),
        total_ventilators=data.get("total_ventilators"),
        anaesthesia_machines=data.get("anaesthesia_machines"),
        defibrillators=data.get("defibrillators"),
        ambulance=data.get("ambulance"),
        surgeons=data.get("surgeons"),
        medical_doctors=data.get("medical_doctors"),
        nurses=data.get("nurses"),
        midwives=data.get("midwives"),
        blood_types_available=data.get("blood_types_available"),
        other_resources=data.get("other_resources"),
    )

    db.session.add(report)
    db.session.commit()

    return jsonify({"message": "Report submitted"}), 201
