SELECT COUNT(*) FROM clients WHERE client_dni = $1;

INSERT INTO clients(
    client_fullname,
    client_email,
    client_phone,
    client_dni,
    client_address,
    client_city
) VALUES(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
);