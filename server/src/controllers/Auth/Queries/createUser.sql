 INSERT INTO managers(
    manager_email,
    manager_name,
    manager_password
) VALUES (
    $1,
    $2,
    $3
) RETURNING *;

INSERT INTO magic_links (
    manager_id,
    link_type,
    created_at,
    expires_at
) VALUES (
    $1,
    $2,
    $3,
    $4
) RETURNING link_id;