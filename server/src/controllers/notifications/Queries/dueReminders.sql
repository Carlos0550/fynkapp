SELECT 
  c.client_name,
  c.client_id,
  c.client_aditional_data,
  COALESCE(d.debt_total, 0) AS total_debt,
  COALESCE(ds.sum_delivers, 0) AS total_delivers,
  d.debt_products,
  d.exp_dates
FROM clients c
LEFT JOIN (
    SELECT 
      client_debt_id, 
      SUM(debt_total) AS debt_total,
      JSON_AGG(debt_products) AS debt_products,
      ARRAY_AGG(exp_date ORDER BY exp_date ASC) AS exp_dates
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

SELECT * FROM business WHERE manager_business_id = $1;


INSERT INTO reminders_history(
    notif_business_id,
    notif_client_id,
    notif_channel,
    notif_status,
    notif_at,
    notif_type
) VALUES(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
);

SELECT * FROM reminders_history WHERE notif_type = 'due_reminder' AND notif_status = 'sent' AND notif_client_id = $1 AND notif_business_id = $2 ORDER BY notif_at DESC LIMIT 1;