INSERT INTO history_debts (
    client_id,
    record_type,
    source_record_id,
    source_table,
    details,
    total,
    operation_date
) VALUES (
    $1,
    $2,
    $3,
    $4, 
    $5,
    $6,
    $7
);
