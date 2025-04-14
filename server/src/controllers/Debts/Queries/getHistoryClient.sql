SELECT 
    c.client_fullname,
    jsonb_agg(jsonb_build_object('id', ch.id, 'created_at', ch.created_at)) AS history
FROM clients c
JOIN client_history ch ON c.client_id = ch.client_id
WHERE c.client_id = $1
AND ch.administrator_id = $2
GROUP BY c.client_fullname, ch.created_at
ORDER BY ch.created_at DESC;

SELECT 
    ch.client_id,
    ch.created_at,
    ch.debt_date,
    ch.total_debts,
    debt_detail,
    deliver_detail 
FROM client_history ch
CROSS JOIN LATERAL jsonb_array_elements(ch.debt_details) AS debt_detail
CROSS JOIN LATERAL jsonb_array_elements(ch.deliver_details) AS deliver_detail
WHERE ch.client_id = $1
AND ch.administrator_id = $2 AND ch.id = $3
ORDER BY ch.debt_date DESC;
