from flask import Blueprint,jsonify
from .services.summary_service import start_account_summary

bp = Blueprint('routes', __name__)

@bp.route('/generate-summary', methods=['POST'])
def generar():
    result, status = start_account_summary()
    return jsonify(result), status