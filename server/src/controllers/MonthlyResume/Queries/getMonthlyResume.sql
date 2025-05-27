SELECT * 
FROM account_summary 
WHERE manager_id = $1 
  AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', $2::timestamp);
