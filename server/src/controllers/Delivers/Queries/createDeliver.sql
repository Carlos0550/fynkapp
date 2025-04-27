INSERT INTO delivers(
    deliver_amount,
    deliver_date,
    deliver_client_id,
    deliver_user_id
) VALUES (
    $1,
    $2,
    $3,
    $4
);

UPDATE debts
    SET exp_date = $1
    WHERE client_debt_id = $2 AND fk_user_id = $3;