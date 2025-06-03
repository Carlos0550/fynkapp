from app import db
from sqlalchemy.exc import SQLAlchemyError
from app.models import Due_payments, Debts
from datetime import datetime
from zoneinfo import ZoneInfo
from flask import jsonify
now_argentina = datetime.now(ZoneInfo("America/Argentina/Buenos_Aires"))

def get_due_debts(
    manager_id: str = "49e010ba-f569-4307-be48-c2524ecf206e", 
    business_id: str = "f5c55514-79e5-4521-b4d2-d3248c0beee6"
):
    due_debts = db.session.query(Debts).filter(
        Debts.manager_client_id == manager_id,
        # Debts.client_debt_id == business_id
    ).all()
    
    print(due_debts)
    
    return jsonify({"status": "ok", "message": "Expiraciones guardadas"})    