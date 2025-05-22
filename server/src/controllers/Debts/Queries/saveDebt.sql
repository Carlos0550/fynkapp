INSERT INTO 
    debts(
        debt_total,
        debt_date,
        exp_date,
        manager_client_id,
        client_debt_id,
        debt_products,
        debt_id
    )
    VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
    );

UPDATE debts
    SET 
        debt_total = $1,
        debt_date = $2,
        exp_date = $3,
        debt_products = $4
    WHERE debt_id = $5;
    