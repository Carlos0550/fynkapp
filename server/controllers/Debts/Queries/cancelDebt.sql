WITH total_debts AS (
    SELECT 
        d.client_debt_id,
        d.debt_date,  
        SUM(
            (p.product->>'product_quantity')::NUMERIC * 
            (p.product->>'product_price')::NUMERIC
        ) AS total_debt_amount,  
        COALESCE(
            jsonb_agg(p.product) FILTER (WHERE p.product IS NOT NULL), '[]'::jsonb
        ) AS debt_details  
    FROM debts d
    CROSS JOIN LATERAL jsonb_array_elements(d.debt_products) AS p(product)  
    WHERE d.client_debt_id = $2  
    GROUP BY d.client_debt_id, d.debt_date 
    ORDER BY d.debt_date DESC 
),
total_delivers AS (
    SELECT 
        deliver_client_id,
        COALESCE(SUM(deliver_amount), 0) AS total_delivers_amount,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'deliver_date', deliver_date,
                    'deliver_amount', deliver_amount
                )
            ) FILTER (WHERE deliver_amount IS NOT NULL), '[]'::jsonb
        ) AS deliver_details
    FROM delivers
    WHERE deliver_client_id = $2  
    GROUP BY deliver_client_id
)
SELECT 
    c.client_id,
    td.debt_date,  
    COALESCE(td.total_debt_amount, 0) AS total_debt_amount,
    COALESCE(td.debt_details, '[]'::jsonb) AS debt_details,
    COALESCE(tdv.total_delivers_amount, 0) AS total_delivers_amount,
    COALESCE(tdv.deliver_details, '[]'::jsonb) AS deliver_details
FROM clients c
LEFT JOIN total_debts td ON c.client_id = td.client_debt_id 
LEFT JOIN total_delivers tdv ON c.client_id = tdv.deliver_client_id 
WHERE c.fk_user_id = $1  
AND c.client_id = $2  
ORDER BY td.debt_date DESC;  

INSERT INTO client_history (
    client_id,
    debt_details,
    deliver_details,
    total_debts,
    total_delivers,
    debt_date,
    administrator_id
) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7
);

DELETE FROM debts WHERE client_debt_id = $1;

DELETE FROM delivers WHERE deliver_client_id = $1;