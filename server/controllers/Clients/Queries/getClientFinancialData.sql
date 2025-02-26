SELECT 
    (SELECT json_agg(d) 
     FROM debts d 
     WHERE d.client_debt_id = $1 AND d.fk_user_id = $2) AS clientDebts;