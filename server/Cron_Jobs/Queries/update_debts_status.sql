UPDATE debts SET debt_status = 'noactive' WHERE debt_status = 'active' AND debt_date < $1;

UPDATE debts SET debt_status = 'active' WHERE debt_status = 'noactive' AND client_debt_id IN(
    SELECT DISTINCT deliver_client_id FROM delivers WHERE deliver_date >= CURRENT_DATE - INTERVAL '2 days'
);