INSERT INTO debts(
    client_debt_id,
    debt_products,
    debt_date,
    fk_user_id
) VALUES($1, $2,$3, $4);