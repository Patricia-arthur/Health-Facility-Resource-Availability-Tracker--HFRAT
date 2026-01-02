from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from datetime import datetime, timedelta
from app.models import ResourceReport, HealthFacility

dashboard_bp = Blueprint("dashboard", __name__)

ALERT_CRITICAL = "CRITICAL"
ALERT_WARNING = "WARNING"
ALERT_NORMAL = "NORMAL"


def compute_alerts(report):
    if report.icu_beds_available is None:
        return ALERT_NORMAL
    if report.icu_beds_available < 3:
        return ALERT_CRITICAL
    elif report.icu_beds_available < 5:
        return ALERT_WARNING
    return ALERT_NORMAL


@dashboard_bp.route("/overview", methods=["GET"])
@jwt_required()
def dashboard_overview():
    claims = get_jwt()
    if claims.get("role") != "MONITOR":
        return jsonify({"error": "Access denied"}), 403

    response = []

    facilities = HealthFacility.query.all()

    for facility in facilities:
        report = (
            ResourceReport.query
            .filter_by(facility_id=facility.id)
            .order_by(ResourceReport.created_at.desc())
            .first()
        )

        if not report:
            continue

        response.append({
            "facility": facility.name,
            "facility_id": facility.id,   # IMPORTANT for frontend clicks
            "status": compute_alerts(report),
            "last_updated": report.created_at.isoformat()
        })

    return jsonify(response), 200


@dashboard_bp.route("/facility/<int:facility_id>", methods=["GET"])
@jwt_required()
def facility_detail(facility_id):
    claims = get_jwt()
    if claims.get("role") != "MONITOR":
        return jsonify({"error": "Access denied"}), 403

    facility = HealthFacility.query.get_or_404(facility_id)

    latest_report = (
        ResourceReport.query
        .filter_by(facility_id=facility.id)
        .order_by(ResourceReport.created_at.desc())
        .first()
    )

    if not latest_report:
        return jsonify({
            "facility": facility.name,
            "latest_report": None,
            "history": []
        }), 200

    seven_days_ago = datetime.utcnow() - timedelta(days=7)

    history = (
        ResourceReport.query
        .filter(
            ResourceReport.facility_id == facility.id,
            ResourceReport.created_at >= seven_days_ago
        )
        .order_by(ResourceReport.created_at.asc())
        .all()
    )

    return jsonify({
        "facility": facility.name,
        "latest_report": {
            "icu_beds_available": latest_report.icu_beds_available,
            "incubators": latest_report.incubators,
            "total_ventilators": latest_report.total_ventilators,
            "anaesthesia_machines": latest_report.anaesthesia_machines,
            "defibrillators": latest_report.defibrillators,
            "ambulance": latest_report.ambulance,
            "surgeons": latest_report.surgeons,
            "medical_doctors": latest_report.medical_doctors,
            "nurses": latest_report.nurses,
            "midwives": latest_report.midwives,
            "blood_types_available": latest_report.blood_types_available,
            "other_resources": latest_report.other_resources,
            "created_at": latest_report.created_at.isoformat()
        },
        "history": [
            {
                "date": r.created_at.isoformat(),
                "icu_beds_available": r.icu_beds_available,
                "total_ventilators": r.total_ventilators,
                "medical_doctors": r.medical_doctors,
                "nurses": r.nurses
            }
            for r in history
        ]
    }), 200
