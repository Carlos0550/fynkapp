SELECT * FROM clients WHERE client_dni = $1 AND fk_user_id = $2;

SELECT * FROM clients WHERE LOWER(client_fullname) LIKE $1 AND fk_user_id = $2;

SELECT * FROM clients WHERE fk_user_id = $1 ORDER BY RANDOM() LIMIT 15;