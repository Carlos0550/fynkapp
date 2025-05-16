SELECT
    COUNT(*)
FROM
    clients
WHERE
    manager_client_id = $1
    AND
    client_aditional_data ->> 'client_dni' = $2;

INSERT INTO
    clients(
        manager_client_id,
        client_aditional_data,
        client_name
    )
VALUES($1,$2, $3);