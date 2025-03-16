import { Button, Flex, Input, Loader } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import "./FastRegisterPaymentForm.css"
import useFastRegisterPaymentForm from './utils/useFastRegisterPaymentForm'

interface FormModal {
  closeModal: () => void
}

function FastRegisterPaymentForm({ closeModal }: FormModal) {
  const {
    step, setStep, searching,
    searchValue, handleSearchValueChange,
    setClientData, clientData,
    registerPayment, sendingPayment
  } = useFastRegisterPaymentForm(
    closeModal
  )
  const [deliverAmount, setDeliverAmount] = useState<number>(0)
  return (
    <form className="fastPayment-form-container">
      <div className="fastPayment-form-steps">
        <div className={`fastPayment-form-step ${step === 1 ? "active" : "hidden"}`}>

          <Input.Wrapper label="DNI del cliente" required description="Ingrese el DNI o nombre del cliente">
            <Input type="text"
              value={searchValue}
              onChange={handleSearchValueChange}
            />
          </Input.Wrapper>
          {searching && (
            <Flex
              align={"center"}
              gap={".5rem"}
            >
              <Loader
                color="blue"
                size="xs"
              />
              <p>Aguarde un segundo...</p>
            </Flex>
          )}
        </div>

        <div className={`fastPayment-form-step ${step === 2 ? "active" : "hidden"}`}>
          {Object.keys(clientData).length > 0 && (
            <>
              {clientData.client_name && (
                <h3>{clientData.client_name}</h3>
              )}
              {clientData.total > 0 ? (
                <p>{clientData.total.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</p>
              ) : (
                <p>Deuda: $0</p>
              )}
            </>
          )}
          <Input.Wrapper label="Monto de entrega" required>
            <Input type="number"
              onChange={(e) => setDeliverAmount(Number(e.target.value))}
            />
          </Input.Wrapper>
          <Flex justify={"space-between"}>
            <Button onClick={() => {
              setClientData({
                client_name: "",
                client_id: "",
                total: 0
              })
              setStep(1)
            }}>Atrás</Button>
            <Button
              onClick={() => registerPayment(deliverAmount)}
              disabled={sendingPayment}
              loading={sendingPayment}
            >Guardar entrega</Button>
          </Flex>
        </div>
      </div>
    </form>
  )
}

export default FastRegisterPaymentForm
