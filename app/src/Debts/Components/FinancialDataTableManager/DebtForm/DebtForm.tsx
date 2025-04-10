import React from "react";
import "./DebtForm.css";
import useDebtForm from "./utils/useDebtForm";
import { ClientsInterface } from "../../../../Context/Typescript/ClientsTypes";
import { Button, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";

interface FormProps {
  clientData: ClientsInterface,
  closeModal: () => void,
  isEditing?: boolean
}

function DebtForm({ clientData, closeModal, isEditing }: FormProps) {
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
  } = useDebtForm(clientData, closeModal, isEditing);

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
        locale="es"
      />
      {dateError && <div className="error-message">{dateError}</div>}
      
      <div className="subtotal-area">
        <p>Total: {parseFloat(total).toLocaleString("es-AR",{style: "currency", currency: "ARS"})}</p>
      </div>

      <Button disabled={savingDebt} loading={savingDebt} type="submit" color="black">{isEditing ? "Actualizar" : "Guardar"}</Button>
    </form>
  );
}

export default DebtForm;