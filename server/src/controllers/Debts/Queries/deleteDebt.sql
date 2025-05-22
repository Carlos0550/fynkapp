SELECT COUNT(*) FROM debts WHERE client_debt_id = $1 AND estado_financiero = 'activo' AND manager_client_id = $2 AND debt_id != $3; --Posicion 0, verifica cuantas deudas hay ademas de la que queremos eliminar--
SELECT COUNT(*) FROM delivers WHERE client_deliver_id = $1 AND estado_financiero = 'activo' AND manager_client_id = $2; --Posicion 1, verifica cuantas entregas tiene el cliente--

SELECT --Posicion 2, obtiene el total de deudas y entregas--
  (SELECT COALESCE(SUM(deliver_amount), 0)
   FROM delivers 
   WHERE client_deliver_id = $1 
     AND estado_financiero = 'activo' 
     AND manager_client_id = $2) AS total_delivers,

  (SELECT COALESCE(SUM(debt_total), 0)
   FROM debts 
   WHERE client_debt_id = $1 
     AND estado_financiero = 'activo' 
     AND manager_client_id = $2 
     AND debt_id != $3) AS total_other_debts;


UPDATE debts SET estado_financiero = 'eliminado' WHERE debt_id = $1; --Posicion 3, elimina la deuda (en teoria)--

UPDATE delivers SET estado_financiero = 'eliminado' WHERE client_deliver_id = $1 AND manager_client_id = $2 AND estado_financiero = 'activo'; --Posicion 3, elimina la deuda (en teoria)--