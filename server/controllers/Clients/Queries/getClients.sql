SELECT * FROM clients WHERE client_dni = $1;

SELECT * FROM clients WHERE LOWER(client_fullname) LIKE $1;

SELECT client_id, client_fullname, client_email FROM clients ORDER BY RANDOM() LIMIT 15;