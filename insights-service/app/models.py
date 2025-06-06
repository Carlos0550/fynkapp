from app import db
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.sql import func
from uuid import uuid4

class AccountSummary(db.Model):
    __tablename__ = 'account_summary'

    summary_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    manager_id = db.Column(UUID(as_uuid=True), db.ForeignKey("managers.manager_id"), nullable=False)
    as_of = db.Column(db.DateTime, nullable=False)
    total_debt = db.Column(db.Numeric(10, 2), nullable=False)
    total_payments = db.Column(db.Numeric(10, 2), nullable=False)
    best_customers = db.Column(JSONB, nullable=False)
    worst_customers = db.Column(JSONB, nullable=False)
    payment_behavior = db.Column(JSONB, nullable=False)
    recovery_rate = db.Column(db.Numeric(5, 2), nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)


class Clients(db.Model):
    __tablename__ = "clients"

    client_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    client_name = db.Column(db.String, nullable=False)
    client_aditional_data = db.Column(JSONB, nullable=False)
    manager_client_id = db.Column(UUID(as_uuid=True), db.ForeignKey("managers.manager_id"), nullable=False)


class Delivers(db.Model):
    __tablename__ = "delivers"

    deliver_id = db.Column(db.String, primary_key=True)
    deliver_amount = db.Column(db.Numeric(10, 2), nullable=False)
    deliver_date = db.Column(db.DateTime, nullable=False)
    manager_client_id = db.Column(UUID(as_uuid=True), db.ForeignKey("managers.manager_id"), nullable=False)
    client_deliver_id = db.Column(UUID(as_uuid=True), db.ForeignKey("clients.client_id"), nullable=False)
    deliver_details = db.Column(db.String, nullable=True)
    estado_financiero = db.Column(db.String, nullable=False)
    fecha_cierre = db.Column(db.DateTime, nullable=True)
    business_deliver_id = db.Column(db.String, nullable=True)


class Debts(db.Model):
    __tablename__ = "debts"

    debt_id = db.Column(db.String, primary_key=True)
    debt_total = db.Column(db.Numeric(10, 2), nullable=False)
    debt_date = db.Column(db.DateTime, nullable=False)
    exp_date = db.Column(db.DateTime, nullable=False)
    debt_products = db.Column(JSONB, nullable=False)
    manager_client_id = db.Column(UUID(as_uuid=True), db.ForeignKey("managers.manager_id"), nullable=False)
    client_debt_id = db.Column(UUID(as_uuid=True), db.ForeignKey("clients.client_id"), nullable=False)
    estado_financiero = db.Column(db.String, nullable=False)
    fecha_cierre = db.Column(db.DateTime, nullable=True)
    business_debt_id = db.Column(db.String, nullable=True)

class Managers(db.Model):
    __tablename__ = "managers"

    manager_id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    manager_name = db.Column(db.String, nullable=False)
    manager_email = db.Column(db.String, nullable=False)
    manager_password = db.Column(db.String, nullable=False)
    manager_verified = db.Column(db.Boolean, nullable=False, default=False)

class Business(db.Model):
    __tablename__ = "business"

    business_id = db.Column(db.String, primary_key=True)
    business_name = db.Column(db.String, nullable=False)
    business_address = db.Column(db.String, nullable=False)
    business_phone = db.Column(db.String, nullable=False)
    business_email = db.Column(db.String, nullable=False)
    manager_business_id = db.Column(UUID(as_uuid=True), db.ForeignKey("managers.manager_id"), nullable=False)
    notif_option = db.Column(db.String, nullable=False, default="both")
class ExpiredPayments(db.Model):
    __tablename__ = "expired_debts"
    expired_id = db.Column(db.Integer, primary_key=True)
    expired_client_id = db.Column(UUID(as_uuid=True), db.ForeignKey("clients.client_id"), nullable=False)
    expired_business_id = db.Column(UUID(as_uuid=True), db.ForeignKey("business.business_id"), nullable=False)
    expired_amount = db.Column(db.Numeric(10, 2), nullable=False)
    expired_date = db.Column(db.DateTime, nullable=False)