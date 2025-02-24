UPDATE clients 
SET
    client_fullname = $1,
    client_dni = $2,
    client_phone = $3,
    client_email = $4,
    client_address = $5,
    client_city = $6
WHERE client_id = $7;