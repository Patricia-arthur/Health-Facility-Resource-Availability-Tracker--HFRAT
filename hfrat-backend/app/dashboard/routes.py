from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.models import ResourceReport, HealthFacility

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/overview", methods=["GET"])
@jwt_required()
def dashboard_overview():
    # JWT identity is user_id stored as string
    user_id = int(get_jwt_identity())

    # JWT claims contain the role
    claims = get_jwt()
    role = claims.get("role")

    # Only MONITORS can access dashboard
    if role != "MONITOR":
        return jsonify({"error": "Access denied"}), 403

    response = []

    facilities = HealthFacility.query.all()

    for facility in facilities:
        latest_report = (
            ResourceReport.query
            .filter_by(facility_id=facility.id)
            .order_by(ResourceReport.created_at.desc())
            .first()
        )

        # Skip facilities with no reports yet
        if not latest_report:
            continue

        response.append({
            "facility": facility.name,
            "icu_beds_available": latest_report.icu_beds_available,
            "total_ventilators": latest_report.total_ventilators,
            "staff_on_duty": {
                "doctors": latest_report.medical_doctors,
                "nurses": latest_report.nurses,
                "midwives": latest_report.midwives
            },
            "last_updated": latest_report.created_at
        })

    return jsonify(response), 200
