INSERT INTO delivers(
    deliver_id,
	deliver_amount,
	deliver_date,
	manager_client_id,
	client_deliver_id,
	deliver_details
) VALUES(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
);

SELECT exp_date FROM debts WHERE client_debt_id = $1 AND manager_client_id = $2;

UPDATE debts 
    SET exp_date = $1 
WHERE client_debt_id = $2 
AND manager_client_id = $3 
AND estado_financiero = 'activo';