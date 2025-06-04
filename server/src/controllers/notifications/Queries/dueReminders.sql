SELECT * FROM business WHERE manager_business_id = $1;

INSERT INTO reminders_history(
    notif_business_id,
    notif_client_id,
    notif_channel,
    notif_status,
    notif_at,
    notif_type
) VALUES(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
);

SELECT * FROM reminders_history WHERE notif_type = 'due_reminder' AND notif_status = 'sent' AND notif_client_id = $1 AND notif_business_id = $2 ORDER BY notif_at DESC LIMIT 1;