SELECT 
  c.client_name, 
  c.client_id,
  c.client_aditional_data,
  COALESCE(d.sum_debts, 0) - COALESCE(ds.sum_delivers, 0) AS total_debts
FROM clients c
LEFT JOIN (
  SELECT client_debt_id, SUM(debt_total) AS sum_debts
  FROM debts
  WHERE estado_financiero = 'activo'
  GROUP BY client_debt_id
) d ON d.client_debt_id = c.client_id
LEFT JOIN (
  SELECT client_deliver_id, SUM(deliver_amount) AS sum_delivers
  FROM delivers
  WHERE estado_financiero = 'activo'
  GROUP BY client_deliver_id
) ds ON ds.client_deliver_id = c.client_id
WHERE c.client_id = $1;
