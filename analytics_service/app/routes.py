from flask import Blueprint, request, jsonify
from .services.summary_service import start_monthly_summary

bp = Blueprint('routes', __name__)

@bp.route('/generate-summary', methods=['POST'])
def generar():
    result, status = start_monthly_summary()
    return jsonify(result), status