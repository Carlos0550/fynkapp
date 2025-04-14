SELECT * FROM clients WHERE client_dni = $1 AND fk_user_id = $2;

SELECT 
    (SELECT json_agg(d) 
     FROM debts d 
     WHERE d.client_debt_id = $1 AND d.fk_user_id = $2) AS clientDebts,
    
    (SELECT json_agg(d) 
     FROM delivers d 
     WHERE d.deliver_client_id = $1 AND d.deliver_user_id = $2) AS clientDelivers;

INSERT INTO delivers(
    deliver_client_id, deliver_user_id, deliver_amount, deliver_date
) VALUES(
    $1, $2, $3, $4
);