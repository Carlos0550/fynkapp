SELECT 
    ch.client_id,
    ch.debt_date,
    ch.total_debts,
    ch.total_delivers,
    debt_detail,  -- 🔥 Cada fila tendrá un producto separado de la deuda
    deliver_detail -- 🔥 Cada fila tendrá un producto separado de la entrega
FROM client_history ch
CROSS JOIN LATERAL jsonb_array_elements(ch.debt_details) AS debt_detail
CROSS JOIN LATERAL jsonb_array_elements(ch.deliver_details) AS deliver_detail
WHERE ch.client_id = $1
AND ch.administrator_id = $2
ORDER BY ch.debt_date DESC;
