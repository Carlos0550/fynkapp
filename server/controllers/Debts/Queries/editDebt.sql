UPDATE debts 
    SET debt_products = $1,
    debt_date = $2
WHERE debt_id = $3;