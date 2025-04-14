UPDATE clients 
SET
    client_fullname = $1,
    client_dni = $2,
    client_phone = $3,
    client_email = $4
WHERE client_id = $5 AND fk_user_id = $6;