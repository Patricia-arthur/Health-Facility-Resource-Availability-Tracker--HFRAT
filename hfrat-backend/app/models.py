from .extensions import db
from datetime import datetime
from sqlalchemy.dialects.sqlite import JSON

class HealthFacility(db.Model):
    __tablename__ = "health_facilities"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique =True, nullable =False)
    
    reports = db.relationship("ResourceReport", backref ="facility", lazy =True)
    
    def __repr__(self):
        return f"<HealthFacility {self.name}>"
    
class User(db.Model):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique= True, nullable = False)
    password = db.Column(db.String(200), nullable =False)
    role = db.Column(db.String(20), nullable=False)
    
    facility_id = db.Column(
        db.Integer,
        db.ForeignKey("health_facilities.id"),
        nullable= True
    )
    
    facility = db.relationship("HealthFacility", backref="users")
    
    def __repr__(self):
        return f"<User {self.username} ({self.role})>"
    
class ResourceReport(db.Model):
    __tablename__ = "resource_reports"
    
    id = db.Column(db.Integer, primary_key=True)
    
    facility_id = db.Column(
        db.Integer,
        db.ForeignKey("health_facilities.id"),
        nullable=False
    )

    reporter_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    # Equipment & capacity
    icu_beds_available = db.Column(db.Integer, nullable=False)
    incubators = db.Column(db.Integer, nullable=False)
    total_ventilators = db.Column(db.Integer, nullable=False)
    anaesthesia_machines = db.Column(db.Integer, nullable=False)
    defibrillators = db.Column(db.Integer, nullable=False)
    ambulance = db.Column(db.Integer, nullable=False)

    # Staff on duty
    surgeons = db.Column(db.Integer, nullable=False)
    medical_doctors = db.Column(db.Integer, nullable=False)
    nurses = db.Column(db.Integer, nullable=False)
    midwives = db.Column(db.Integer, nullable=False)

    # Flexible resources
    blood_types_available = db.Column(JSON, nullable=True)
    other_resources = db.Column(JSON, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    reporter = db.relationship("User")

    def __repr__(self):
        return f"<ResourceReport facility={self.facility_id} time={self.created_at}>"
