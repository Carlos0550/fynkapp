from app import db
from sqlalchemy.exc import SQLAlchemyError
from app.models import AccountSummary, Managers, Debts, Delivers, Clients
from datetime import datetime
from zoneinfo import ZoneInfo
from uuid import uuid4

# Obtiene todas las deudas activas del administrador (historial completo)
def get_manager_debts(manager_id: str):
    return db.session.query(Debts).filter(
        Debts.manager_client_id == manager_id
    ).all()

# Obtiene todos los pagos realizados por el administrador (historial completo)
def get_manager_delivers(manager_id: str):
    return db.session.query(Delivers).filter(
        Delivers.manager_client_id == manager_id
    ).all()

# Obtiene todos los clientes de un administrador
def get_manager_clients(manager_id: str):
    return db.session.query(Clients).filter(
        Clients.manager_client_id == manager_id
    ).all()

# Calcula un score de historial en base a deudas cerradas y sus atrasos
def calcular_score_historial(client_id, all_delivers):
    historial_deudas = db.session.query(Debts).filter(
        Debts.client_debt_id == client_id,
        Debts.estado_financiero == "cerrado"
    ).all()

    # Sin historial cerrado => score mínimo (mal pagador)
    if not historial_deudas:
        return 0.0

    dias_total = 0
    cantidad = 0
    for deuda in historial_deudas:
        # buscar primer pago posterior a la deuda
        entregas = [e for e in all_delivers if e.client_deliver_id == client_id and e.deliver_date >= deuda.debt_date]
        if entregas:
            entrega = min(entregas, key=lambda e: e.deliver_date)
            dias_atraso = (entrega.deliver_date.date() - deuda.exp_date.date()).days
            dias_total += max(dias_atraso, 0)
            cantidad += 1

    if cantidad == 0:
        return 0.0

    promedio_dias = dias_total / cantidad
    if promedio_dias >= 60:
        return 0.0
    if promedio_dias >= 30:
        return 0.5
    return 1.0 - (promedio_dias / 60)

# Genera resumen de cuenta completo (historial de toda la vida)
def generate_account_summary(clients_dict: dict, manager_id: str, as_of: datetime, all_delivers: list):
    total_debt = 0
    total_payments = 0
    riesgo_clientes = []
    behavior_ranges = {"0-15": [], "16-30": [], "31-60": [], "60+": []}

    for client_id, client_data in clients_dict.items():
        if not client_data["deudas"] and not client_data["entregas"]:
            continue
        deuda_total = sum(float(d.debt_total) for d in client_data["deudas"])
        pago_total = sum(float(p.deliver_amount) for p in client_data["entregas"])
        total_debt += deuda_total
        total_payments += pago_total

        # calcular atraso usando la deuda y entrega más antiguas
        if client_data["deudas"] and client_data["entregas"]:
            deuda_old = min(client_data["deudas"], key=lambda d: d.debt_date)
            entrega_old = min(client_data["entregas"], key=lambda e: e.deliver_date)
            dias_retraso = max((entrega_old.deliver_date.date() - deuda_old.exp_date.date()).days, 0)
            rango = (
                "0-15" if dias_retraso <= 15 else
                "16-30" if dias_retraso <= 30 else
                "31-60" if dias_retraso <= 60 else "60+"
            )
            behavior_ranges[rango].append({
                "id": str(client_data["cliente"].client_id),
                "name": client_data["cliente"].client_name,
                "pago": float(entrega_old.deliver_amount),
                "dias_retraso": dias_retraso,
                "fecha_pago": entrega_old.deliver_date.strftime("%Y-%m-%d"),
                "fecha_vencimiento": deuda_old.exp_date.strftime("%Y-%m-%d")
            })
        else:
            dias_retraso = 0

        historial_score = calcular_score_historial(client_id, all_delivers)
        riesgo_clientes.append({
            "id": str(client_data["cliente"].client_id),
            "name": client_data["cliente"].client_name,
            "deuda": deuda_total,
            "atraso_prom": dias_retraso,
            "historial": historial_score
        })

    # evitar divisiones por cero
    max_deuda = max((c["deuda"] for c in riesgo_clientes), default=1)
    max_atraso = max((c["atraso_prom"] for c in riesgo_clientes), default=1)

    for c in riesgo_clientes:
        c["riesgo"] = round(
            (c["deuda"] / max_deuda) * 0.4 +
            (c["atraso_prom"] / max_atraso if c["atraso_prom"] > 0 else 0) * 0.4 +
            (1 - c["historial"]) * 0.2,
            4
        )

    # ordenar clientes por riesgo
    clientes_ordenados = sorted(riesgo_clientes, key=lambda x: x["riesgo"], reverse=True)

    # separar buenos y malos según umbral
    best_customers = [c for c in clientes_ordenados if c["riesgo"] <= 0.5]
    worst_customers = [c for c in clientes_ordenados if c["riesgo"] > 0.5]

    payment_behavior = {
        r: {"clientes": lst, "total": sum(c["pago"] for c in lst), "cantidad": len(lst)}
        for r, lst in behavior_ranges.items()
    }

    recovery_rate = (total_payments / total_debt) * 100 if total_debt else 0

    summary = AccountSummary(
        summary_id=uuid4(),
        manager_id=manager_id,
        as_of=as_of,
        total_debt=total_debt,
        total_payments=total_payments,
        best_customers=best_customers,
        worst_customers=worst_customers,
        payment_behavior=payment_behavior,
        recovery_rate=recovery_rate
    )

    try:
        db.session.add(summary)
        db.session.commit()
        return {"ok": True, "msg": "Inserción exitosa"}, 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return {"ok": False, "msg": str(e)}, 500

# Ejecuta la generación de resúmenes de cuenta para todos los administradores
def start_account_summary():
    now = datetime.now(ZoneInfo("America/Argentina/Buenos_Aires"))
    managers = db.session.query(Managers.manager_id).all()
    all_delivers = db.session.query(Delivers).all()

    for manager in managers:
        # construir diccionario de clientes
        clientes_dict = {}
        debts = get_manager_debts(manager.manager_id)
        delivers = get_manager_delivers(manager.manager_id)
        clients = get_manager_clients(manager.manager_id)

        for cliente in clients:
            clientes_dict[cliente.client_id] = {"cliente": cliente, "deudas": [], "entregas": []}

        for d in debts:
            if d.client_debt_id in clientes_dict:
                clientes_dict[d.client_debt_id]["deudas"].append(d)
        for e in delivers:
            if e.client_deliver_id in clientes_dict:
                clientes_dict[e.client_deliver_id]["entregas"].append(e)

        resumen, status = generate_account_summary(clientes_dict, manager.manager_id, now, all_delivers)
        if status != 201:
            return resumen, status

    return {"ok": True, "msg": "Resúmenes de cuenta generados correctamente"}, 200
