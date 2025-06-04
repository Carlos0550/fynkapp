INSERT INTO delivers(
    deliver_id,
	deliver_amount,
	deliver_date,
	manager_client_id,
	client_deliver_id,
	deliver_details,
  business_deliver_id
) VALUES(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7
);

-- Posicional 2
UPDATE debts
SET exp_date = $1
WHERE client_debt_id = $2
  AND manager_client_id = $3
  AND estado_financiero = 'activo';

SELECT COALESCE(SUM(debt_total), 0) AS total_deuda
        FROM debts
        WHERE client_debt_id = $1 AND manager_client_id = $2 AND estado_financiero = 'activo';

SELECT COALESCE(SUM(deliver_amount), 0) AS total_entregas
        FROM delivers
        WHERE client_deliver_id = $1 AND manager_client_id = $2 AND estado_financiero = 'activo';

UPDATE debts
          SET estado_financiero = 'cerrado', fecha_cierre = $3
          WHERE client_debt_id = $1 AND manager_client_id = $2 AND estado_financiero = 'activo';

UPDATE delivers
          SET estado_financiero = 'cerrado', fecha_cierre = $3
          WHERE client_deliver_id = $1 AND manager_client_id = $2 AND estado_financiero = 'activo';

UPDATE delivers
          SET deliver_amount = $1,
            deliver_date = $2,
            deliver_details = $3
          WHERE deliver_id = $4;

DELETE FROM expired_debts WHERE expired_client_id = $1 AND expired_business_id = $2;