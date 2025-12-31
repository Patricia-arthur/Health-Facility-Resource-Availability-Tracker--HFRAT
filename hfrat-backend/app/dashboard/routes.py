from datetime import datetime, timedelta
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.models import ResourceReport, HealthFacility

dashboard_bp = Blueprint("dashboard", __name__)

# Alert level constants
ALERT_CRITICAL = "CRITICAL"
ALERT_WARNING = "WARNING"
ALERT_NORMAL = "NORMAL"


def compute_alerts(report):
    alerts = {}

    # ICU beds alert
    if report.icu_beds_available is not None:
        if report.icu_beds_available < 3:
            alerts["icu_beds"] = ALERT_CRITICAL
        elif report.icu_beds_available < 5:
            alerts["icu_beds"] = ALERT_WARNING
        else:
            alerts["icu_beds"] = ALERT_NORMAL

    # Ventilators alert
    if report.total_ventilators is not None:
        if report.total_ventilators < 3:
            alerts["ventilators"] = ALERT_CRITICAL
        else:
            alerts["ventilators"] = ALERT_NORMAL

    # Staffing alert (doctors + nurses)
    total_staff = (
        (report.medical_doctors or 0) +
        (report.nurses or 0)
    )

    if total_staff < 10:
        alerts["staffing"] = ALERT_CRITICAL
    elif total_staff < 20:
        alerts["staffing"] = ALERT_WARNING
    else:
        alerts["staffing"] = ALERT_NORMAL

    return alerts


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

        alerts = compute_alerts(latest_report)
        response.append({
            "facility": facility.name,
            "icu_beds_available": latest_report.icu_beds_available,
            "total_ventilators": latest_report.total_ventilators,
            "staff_on_duty": {
                "doctors": latest_report.medical_doctors,
                "nurses": latest_report.nurses,
                "midwives": latest_report.midwives
            },
            "alerts": alerts,
            "last_updated": latest_report.created_at
        })

    return jsonify(response), 200

@dashboard_bp.route("/history/<int:facility_id>", methods=["GET"])
@jwt_required()
def facility_history(facility_id):
    claims = get_jwt()
    role = claims.get("role")

    # Only MONITORS can access history
    if role != "MONITOR":
        return jsonify({"error": "Access denied"}), 403

    seven_days_ago = datetime.utcnow() - timedelta(days=7)

    reports = (
        ResourceReport.query
        .filter(
            ResourceReport.facility_id == facility_id,
            ResourceReport.created_at >= seven_days_ago
        )
        .order_by(ResourceReport.created_at.asc())
        .all()
    )

    history = []

    for report in reports:
        history.append({
            "date": report.created_at.isoformat(),
            "icu_beds_available": report.icu_beds_available,
            "total_ventilators": report.total_ventilators
        })

    return jsonify({
        "facility_id": facility_id,
        "days": 7,
        "data": history
    }), 200

