from flask import Blueprint,jsonify
from .services.summary_service import start_account_summary
from .services.expirations_service import get_due_debts

bp = Blueprint('routes', __name__)

@bp.route('/generate-summary', methods=['POST'])
def generar():
    result, status = start_account_summary()
    return jsonify(result), status

@bp.route("/save-expirations", methods=["POST"])
def save_expirations():
    return get_due_debts()
