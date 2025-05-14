import React from "react";
import "./ClientDebtForm.css";
import useDebtForm from "./utils/useDebtForm";
import { ClientsInterface } from "../../../../../Context/Typescript/ClientsTypes";
import { Button, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";

interface FormProps {
  closeModal: () => void,
}

function ClientDebtForm({ closeModal }: FormProps) {
  const {
    formValues,
    handleTextChange,
    handleDateChange,
    dateParser,
    validationsErrors,
    dateError,
    total,
    onFinish,
    savingDebt
  } = useDebtForm(closeModal);

  return (
    <form onSubmit={onFinish}>
      <Textarea
        label="Productos"
        description="Para el precio de cada producto, no use puntos (.) ni comas (,) para separarlos. a menos que estén en decimal."
        placeholder="Ingrese productos en formato: CANTIDAD | PRODUCTO | PRECIO"
        value={formValues.debt_products}
        onChange={handleTextChange}
        name="debt_products"
        withAsterisk
        error={validationsErrors.length > 0} 
        autosize
      />
      {validationsErrors.length > 0 && (
        <div className="validation-errors">
          {validationsErrors.map((error, index) => (
            <div key={index} className="error-message">
              ⚠️ {error}
            </div>
          ))}
        </div>
      )}

      <DateInput
        label="Fecha de compra (hoy para fecha actual)"
        value={formValues.debt_date}
        onChange={handleDateChange}
        dateParser={dateParser}
        name="debt_date"
        withAsterisk
        valueFormat="DD/MM/YYYY"
        error={!!dateError} 
        locale="es"
      />
      {dateError && <div className="error-message">{dateError}</div>}
      
      <div className="subtotal-area">
        <p>Total: {total.toLocaleString("es-AR",{style: "currency", currency: "ARS"})}</p>
      </div>

      <Button disabled={savingDebt} loading={savingDebt} type="submit" color="black">Guardar</Button>
    </form>
  );
}

export default ClientDebtForm;