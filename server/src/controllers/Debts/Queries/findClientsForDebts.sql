WITH total_debts AS (
    SELECT 
        d.client_debt_id,
        d.fk_user_id,
        SUM((p.product->>'product_quantity')::NUMERIC * (p.product->>'product_price')::NUMERIC) AS total_debt_amount
    FROM debts d
    CROSS JOIN LATERAL jsonb_array_elements(d.debt_products) AS p(product) 
    GROUP BY d.client_debt_id, d.fk_user_id
),
total_delivers AS (
    SELECT 
        deliver_client_id,
        deliver_user_id,
        COALESCE(SUM(deliver_amount), 0) AS total_deliver_amount
    FROM delivers
    GROUP BY deliver_client_id, deliver_user_id
)
SELECT 
    c.client_id,
    c.client_fullname,
    c.client_dni,
    COALESCE(td.total_debt_amount, 0) - COALESCE(td2.total_deliver_amount, 0) AS debt_amount,
    CASE
        WHEN COALESCE(td.total_debt_amount, 0) - COALESCE(td2.total_deliver_amount, 0) > 0 THEN 'active'
        ELSE 'no_debt'
    END AS debt_status
FROM clients c
LEFT JOIN total_debts td ON c.client_id = td.client_debt_id
LEFT JOIN total_delivers td2 ON c.client_id = td2.deliver_client_id
WHERE c.fk_user_id = $1 
  AND c.client_fullname ILIKE $2;



--Para consultas con DNI
WITH total_debts AS (
    SELECT 
        d.client_debt_id,
        d.fk_user_id,
        SUM((p.product->>'product_quantity')::NUMERIC * (p.product->>'product_price')::NUMERIC) AS total_debt_amount
    FROM debts d
    CROSS JOIN LATERAL jsonb_array_elements(d.debt_products) AS p(product) 
    GROUP BY d.client_debt_id, d.fk_user_id
),
total_delivers AS (
    SELECT 
        deliver_client_id,
        deliver_user_id,
        COALESCE(SUM(deliver_amount), 0) AS total_deliver_amount
    FROM delivers
    GROUP BY deliver_client_id, deliver_user_id
)
SELECT 
    c.client_id,
    c.client_fullname,
    c.client_dni,
    COALESCE(td.total_debt_amount, 0) - COALESCE(td2.total_deliver_amount, 0) AS debt_amount,
    CASE
        WHEN COALESCE(td.total_debt_amount, 0) - COALESCE(td2.total_deliver_amount, 0) > 0 THEN 'active'
        ELSE 'no_debt'
    END AS debt_status
FROM clients c
LEFT JOIN total_debts td ON c.client_id = td.client_debt_id
LEFT JOIN total_delivers td2 ON c.client_id = td2.deliver_client_id
WHERE c.fk_user_id = $1 
  AND c.client_dni = $2;


--Traer todos los clientes (limite de 5)
WITH total_debts AS (
    SELECT 
        d.client_debt_id,
        d.fk_user_id,
        SUM((p.product->>'product_quantity')::NUMERIC * (p.product->>'product_price')::NUMERIC) AS total_debt_amount
    FROM debts d
    CROSS JOIN LATERAL jsonb_array_elements(d.debt_products) AS p(product) 
    GROUP BY d.client_debt_id, d.fk_user_id
),
total_delivers AS (
    SELECT 
        deliver_client_id,
        deliver_user_id,
        COALESCE(SUM(deliver_amount), 0) AS total_deliver_amount
    FROM delivers
    GROUP BY deliver_client_id, deliver_user_id
)
SELECT 
    c.client_id,
    c.client_fullname,
    c.client_dni,
    COALESCE(td.total_debt_amount, 0) - COALESCE(td2.total_deliver_amount, 0) AS debt_amount,
    CASE
        WHEN COALESCE(td.total_debt_amount, 0) - COALESCE(td2.total_deliver_amount, 0) > 0 THEN 'active'
        ELSE 'no_debt'
    END AS debt_status
FROM clients c
LEFT JOIN total_debts td ON c.client_id = td.client_debt_id AND td.fk_user_id = $1
LEFT JOIN total_delivers td2 ON c.client_id = td2.deliver_client_id AND td2.deliver_user_id = $1
WHERE c.fk_user_id = $1
LIMIT 10;

