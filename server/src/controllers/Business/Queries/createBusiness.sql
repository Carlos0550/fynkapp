INSERT INTO business(
    business_name,
    business_address,
    business_phone, 
    manager_business_id
) VALUES (
    $1,
    $2,
    $3,
    $4
) RETURNING *;
