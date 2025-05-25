from app import db
from sqlalchemy.dialects.postgresql import JSONB, UUID

class MonthlySummary(db.Model):
    __tablename__ = 'monthly_summary'

    resume_id = db.Column(db.String, primary_key=True)
    resume_month = db.Column(db.String, nullable=False)
    summary_manager_id = db.Column(UUID(as_uuid=True), db.ForeignKey("managers.manager_id"), nullable=False)
    resume_debt_total = db.Column(db.Numeric(10, 2), nullable=False)
    resume_payments_total = db.Column(db.Numeric(10, 2), nullable=False)
    best_customers = db.Column(JSONB, nullable=False)
    worst_customers = db.Column(JSONB, nullable=False)
    payment_behavior = db.Column(JSONB, nullable=False)
    recovery_rate = db.Column(db.Numeric(5, 2), nullable=False)
    
class Clients(db.Model):
    __tablename__ = "clients"
    
    client_id = db.Column(UUID(as_uuid=True), primary_key=True)
    client_name = db.Column(db.String, nullable=False)
    client_aditional_data = db.Column(JSONB, nullable=False)
    manager_client_id = db.Column(UUID(as_uuid=True), nullable=False)
class Delivers(db.Model):
    __tablename__ = "delivers"

    deliver_id = db.Column(db.String, primary_key=True, nullable=False)
    deliver_amount = db.Column(db.Numeric(10, 2), nullable=False)
    deliver_date = db.Column(db.DateTime, nullable=False)
    manager_client_id = db.Column(UUID(as_uuid=True), nullable=False)
    client_deliver_id = db.Column(UUID(as_uuid=True), nullable=False)
    deliver_details = db.Column(db.String, nullable=True)
    estado_financiero = db.Column(db.String, nullable=False)
    
class Debts(db.Model):
    __tablename__ = "debts"
    
    debt_id = db.Column(db.String, primary_key=True, nullable=False)
    debt_total = db.Column(db.Numeric(10, 2), nullable=False)
    debt_date = db.Column(db.DateTime, nullable=False)
    exp_date = db.Column(db.DateTime, nullable=False)
    debt_products = db.Column(JSONB, nullable=False)
    manager_client_id = db.Column(UUID(as_uuid=True), nullable=False)
    client_debt_id = db.Column(UUID(as_uuid=True), nullable=False)
    estado_financiero = db.Column(db.String, nullable=False)
    
class Managers(db.Model):
    __tablename__ = "managers"
    
    manager_id = db.Column(UUID(as_uuid=True), primary_key=True)
    manager_name = db.Column(db.String, nullable=False)
    manager_email = db.Column(db.String, nullable=False)
    manager_password = db.Column(db.String, nullable=False)
    manager_verified = db.Column(db.Boolean, nullable=False)