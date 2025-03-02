INSERT INTO delivers(
    deliver_amount,
    deliver_date,
    deliver_client_id,
    deliver_user_id
) VALUES (
    $1,
    $2,
    $3,
    $4
);