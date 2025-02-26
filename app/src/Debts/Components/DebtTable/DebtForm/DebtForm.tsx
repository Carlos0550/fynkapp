import React from "react";
import "./DebtForm.css";
import useDebtForm from "./utils/useDebtForm";
import { ClientsInterface } from "../../../../Context/Typescript/ClientsTypes";
import { Button, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import dayjs from "dayjs";

interface FormProps {
  clientData: ClientsInterface,
  closeModal: () => void
}

function DebtForm({ clientData, closeModal }: FormProps) {
  const {
    formValues,
    handleTextChange,
    handleDateChange,
    dateParser,
    validationsErrors,
    dateError,
    total,
    onFinish
  } = useDebtForm(clientData, closeModal);

  return (
    <form onSubmit={onFinish}>
      <Textarea
        label="Productos"
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
      />
      {dateError && <div className="error-message">{dateError}</div>}
      
      <div className="subtotal-area">
        <p>Total: {parseFloat(total).toLocaleString("es-AR",{style: "currency", currency: "ARS"})}</p>
      </div>

      <Button type="submit" color="black">Guardar</Button>
    </form>
  );
}

export default DebtForm;