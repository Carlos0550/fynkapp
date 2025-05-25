from app import db
from sqlalchemy.exc import SQLAlchemyError
from app.models import MonthlySummary, Managers, Debts, Delivers, Clients
from datetime import datetime
from zoneinfo import ZoneInfo
from uuid import uuid4
from dateutil.relativedelta import relativedelta
from flask import jsonify

def get_manager_debts(manager_id: str, month: str):
    start_date = datetime.strptime(month, "%Y-%m")
    end_date = start_date + relativedelta(months=1)
    return db.session.query(Debts).filter(
        Debts.manager_client_id == manager_id,
        Debts.debt_date >= start_date,
        Debts.debt_date < end_date
    ).all()

def get_manager_delivers(manager_id: str, month: str):
    start_date = datetime.strptime(month, "%Y-%m")
    end_date = start_date + relativedelta(months=1)
    return db.session.query(Delivers).filter(
        Delivers.manager_client_id == manager_id,
        Delivers.deliver_date >= start_date,
        Delivers.deliver_date < end_date
    ).all()

def get_manager_clients(manager_id: str):
    return db.session.query(Clients).filter(
        Clients.manager_client_id == manager_id
    ).all()

def calcular_score_historial(client_id, all_delivers):
    historial_deudas = db.session.query(Debts).filter(
        Debts.client_debt_id == client_id,
        Debts.estado_financiero == "cerrado"
    ).all()

    if not historial_deudas:
        return 1.0

    dias_total = 0
    cantidad = 0

    for deuda in historial_deudas:
        entregas = [e for e in all_delivers if e.client_deliver_id == client_id and e.deliver_date >= deuda.debt_date]
        if entregas:
            entrega = entregas[0]
            dias_atraso = (entrega.deliver_date.date() - deuda.exp_date.date()).days
            dias_total += max(dias_atraso, 0)
            cantidad += 1

    if cantidad == 0:
        return 1.0

    promedio_dias = dias_total / cantidad
    if promedio_dias >= 60:
        return 0.0
    elif promedio_dias >= 30:
        return 0.5
    else:
        return 1.0 - (promedio_dias / 60)

def generate_monthly_resume(clients_dict: dict, manager_id: str, month: str, all_delivers: list):
    total_monthly_debts = 0
    total_monthly_payments = 0
    riesgo_clientes = []
    behavior_ranges = {"0-15": [], "16-30": [], "31-60": [], "60+": []}

    for client_id, client_data in clients_dict.items():
        deuda_total = sum([float(d.debt_total) for d in client_data["deudas"]])
        pago_total = sum([float(p.deliver_amount) for p in client_data["entregas"]])
        total_monthly_debts += deuda_total
        total_monthly_payments += pago_total

        atrasos = []
        entrega_reciente = max(client_data["entregas"], key=lambda e: e.deliver_date, default=None)
        if entrega_reciente:
            deuda_match = next((d for d in client_data["deudas"] if entrega_reciente.deliver_date >= d.debt_date), None)
            if deuda_match:
                dias_retraso = (entrega_reciente.deliver_date.date() - deuda_match.exp_date.date()).days
                dias_retraso = max(dias_retraso, 0)
                atrasos.append(dias_retraso)

                rango = (
                    "0-15" if dias_retraso <= 15 else
                    "16-30" if dias_retraso <= 30 else
                    "31-60" if dias_retraso <= 60 else "60+"
                )

                behavior_ranges[rango].append({
                    "name": client_data["cliente"].client_name,
                    "id": str(client_data["cliente"].client_id),
                    "pago": float(entrega_reciente.deliver_amount),
                    "dias_retraso": dias_retraso,
                    "fecha_pago": entrega_reciente.deliver_date.strftime("%Y-%m-%d"),
                    "fecha_vencimiento": deuda_match.exp_date.strftime("%Y-%m-%d")
                })

        promedio_atraso = sum(atrasos) / len(atrasos) if atrasos else 0
        historial_score = calcular_score_historial(client_id, all_delivers)

        riesgo_clientes.append({
            "id": str(client_data["cliente"].client_id),
            "name": client_data["cliente"].client_name,
            "deuda": deuda_total,
            "atraso_prom": promedio_atraso,
            "historial": historial_score
        })

    max_deuda = max([c["deuda"] for c in riesgo_clientes], default=1)
    max_atraso = max([c["atraso_prom"] for c in riesgo_clientes], default=0)
    if max_atraso == 0:
        max_atraso = 1

    for c in riesgo_clientes:
        deuda = c["deuda"]
        atraso = c["atraso_prom"]
        historial = c["historial"]

        c["riesgo"] = round(
            (deuda / max_deuda) * 0.4 +
            (atraso / max_atraso) * 0.4 +
            (1 - historial) * 0.2,
            4
        )

    clientes_de_mayor_riesgo = sorted(riesgo_clientes, key=lambda x: x["riesgo"], reverse=True)

    payment_behavior = {}
    for rango, lista in behavior_ranges.items():
        payment_behavior[rango] = {
            "clientes": lista,
            "total": sum([c["pago"] for c in lista]),
            "cantidad": len(lista)
        }

    recovery_rate = (total_monthly_payments / total_monthly_debts) * 100 if total_monthly_debts else 0

    monthly_summary = MonthlySummary(
        resume_id=str(uuid4()),
        resume_month=month,
        summary_manager_id=manager_id,
        resume_debt_total=total_monthly_debts,
        resume_payments_total=total_monthly_payments,
        best_customers=clientes_de_mayor_riesgo[:1] if len(clientes_de_mayor_riesgo) > 0 else [],
        worst_customers=clientes_de_mayor_riesgo[-1:] if len(clientes_de_mayor_riesgo) > 1 else [],
        payment_behavior=payment_behavior,
        recovery_rate=recovery_rate
    )

    try:
        db.session.add(monthly_summary)
        db.session.commit()
        return {"ok": True, "msg": "Inserción exitosa"}, 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return {"ok": False, "msg": str(e) or "Error al generar el resumen mensual"}, 500

def start_monthly_summary():
    now = datetime.now(ZoneInfo("America/Argentina/Buenos_Aires"))
    date_target = f"{now.year}-{now.month}"
    managers = db.session.query(Managers.manager_id).all()

    all_delivers = db.session.query(Delivers).filter(
        Delivers.estado_financiero == "cerrado"
    ).all()

    for manager in managers:
        clientes_dict = {}
        monthly_debts = get_manager_debts(manager.manager_id, date_target)
        monthly_delivers = get_manager_delivers(manager.manager_id, date_target)
        clients = get_manager_clients(manager.manager_id)

        for cliente in clients:
            clientes_dict[cliente.client_id] = {
                "cliente": cliente,
                "deudas": [],
                "entregas": []
            }

        for deuda in monthly_debts:
            cliente_id = deuda.client_debt_id
            if cliente_id in clientes_dict:
                clientes_dict[cliente_id]["deudas"].append(deuda)

        for entrega in monthly_delivers:
            cliente_id = entrega.client_deliver_id
            if cliente_id in clientes_dict:
                clientes_dict[cliente_id]["entregas"].append(entrega)

        resumen, status = generate_monthly_resume(clientes_dict, manager.manager_id, date_target, all_delivers)
        if status != 201:
            return resumen, status

    return {"ok": True, "msg": "Resúmenes generados correctamente"}, 200