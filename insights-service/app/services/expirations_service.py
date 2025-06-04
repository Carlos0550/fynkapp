from app import db
from sqlalchemy.exc import SQLAlchemyError
from app.models import ExpiredPayments, Debts, Delivers
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from collections import defaultdict

now_argentina = datetime.now(ZoneInfo("America/Argentina/Buenos_Aires"))

def get_expired_debts():
    try:
        expired_or_soon = db.session.query(Debts).filter(
            Debts.estado_financiero == "activo",
            Debts.exp_date <= now_argentina + timedelta(days=7)
        ).all()

        grouped_debts = defaultdict(list)
        for debt in expired_or_soon:
            key = (debt.client_debt_id, debt.business_debt_id)
            grouped_debts[key].append(debt)

        for (client_id, business_id), debts in grouped_debts.items():
            total_deuda = sum(float(d.debt_total) for d in debts)
            most_recent_due = max(d.exp_date for d in debts)

            pagos = db.session.query(Delivers).filter(
                Delivers.estado_financiero == "activo",
                Delivers.client_deliver_id == client_id,
                Delivers.business_deliver_id == business_id
            ).all()
            total_pago = sum(float(p.deliver_amount) for p in pagos)

            expired_amount = max(total_deuda - total_pago, 0)
            existing = db.session.query(ExpiredPayments).filter_by(
                expired_client_id=client_id,
                expired_business_id=business_id
            ).first()

            if existing:
                existing.expired_amount = expired_amount
                existing.expired_date = most_recent_due
            else:
                new_exp = ExpiredPayments(
                    expired_client_id=client_id,
                    expired_business_id=business_id,
                    expired_amount=expired_amount,
                    expired_date=most_recent_due
                )
                db.session.add(new_exp)

        db.session.commit()
        return {"ok": True, "msg": "Deudas vencidas guardadas correctamente"}, 200

    except SQLAlchemyError as e:
        db.session.rollback()
        print("❌ Error al guardar deudas vencidas:", str(e))
        return {"ok": False, "msg": "Error al actualizar las deudas vencidas"}, 500
