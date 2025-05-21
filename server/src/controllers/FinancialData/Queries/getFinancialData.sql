SELECT 
  d.debt_id AS id,
  d.debt_date AS fecha,
  d.exp_date AS vencimiento,
  d.debt_total AS monto,
  d.debt_products::jsonb AS productos,
  NULL::text AS detalles,
  'deuda' AS tipo,
  d.estado_financiero AS estado_financiero
FROM debts d
WHERE 
  d.manager_client_id = $1 AND 
  d.client_debt_id = $2

UNION ALL

SELECT 
  p.deliver_id AS id,
  p.deliver_date AS fecha,
  NULL::timestamp AS vencimiento, 
  p.deliver_amount AS monto,
  NULL::jsonb AS productos,
  p.deliver_details AS detalles,
  'pago' AS tipo,
    p.estado_financiero AS estado_financiero

FROM delivers p
WHERE 
  p.manager_client_id = $1 AND 
  p.client_deliver_id = $2

ORDER BY fecha DESC;
