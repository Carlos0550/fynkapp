SELECT COUNT(*) FROM clients WHERE client_dni = $1 AND fk_user_id = $2;

INSERT INTO clients(
    client_fullname,
    client_email,
    client_phone,
    client_dni,
    fk_user_id
) VALUES(
    $1,
    $2,
    $3,
    $4,
    $5
);