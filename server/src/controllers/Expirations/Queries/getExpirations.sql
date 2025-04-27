WITH

toOvercome AS (
    SELECT 
        d.client_debt_id,
        c.client_fullname,
        d.debt_date,
        d.exp_date,
        (
            SELECT MAX(dl.deliver_date)
            FROM delivers dl
            WHERE dl.deliver_client_id = d.client_debt_id
              AND dl.deliver_user_id = $1 
        ) AS last_deliver_date,
        (
            SELECT dl.deliver_amount
            FROM delivers dl
            WHERE dl.deliver_client_id = d.client_debt_id
              AND dl.deliver_user_id = $1  
            ORDER BY dl.deliver_date DESC
            LIMIT 1
        ) AS last_deliver_amount, 
        (d.exp_date - CURRENT_DATE) AS days_remaining,
        'toOvercome' AS exp_type 
    FROM debts d
    JOIN clients c ON c.client_id = d.client_debt_id
    WHERE d.debt_status = 'active'
      AND d.fk_user_id = $1 
      AND d.exp_date > CURRENT_DATE
      AND d.exp_date <= CURRENT_DATE + INTERVAL '7 days'
),

expired AS (
    SELECT 
        d.client_debt_id,
        c.client_fullname,
        d.debt_date,
        d.exp_date,
        (
            SELECT MAX(dl.deliver_date)
            FROM delivers dl
            WHERE dl.deliver_client_id = d.client_debt_id
              AND dl.deliver_user_id = $1  
        ) AS last_deliver_date,
        (
            SELECT dl.deliver_amount
            FROM delivers dl
            WHERE dl.deliver_client_id = d.client_debt_id
              AND dl.deliver_user_id = $1  
            ORDER BY dl.deliver_date DESC
            LIMIT 1
        ) AS last_deliver_amount,
        (CURRENT_DATE - d.exp_date) AS days_remaining,
        'expired' AS exp_type  
    FROM debts d
    JOIN clients c ON c.client_id = d.client_debt_id
    WHERE d.debt_status = 'expired'
      AND d.fk_user_id = $1  
      AND d.exp_date < CURRENT_DATE
)

SELECT * FROM toOvercome
UNION ALL
SELECT * FROM expired;
