import React from 'react';
import { ClientsInterface } from '../../../../Context/Typescript/ClientsTypes';
import "./DeliversForm.css";
import { Button, Input } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import useDeliversForm from './utils/useDeliversForm';
import { useAppContext } from '../../../../Context/AppContext';

interface FormProps {
    clientData: ClientsInterface;
    closeModal: () => void;
    isEditing?: boolean;
}

function DeliversForm({ clientData, closeModal, isEditing }: FormProps) {
    const { formValues, handleInputChange, handleDateChange, onFinish } = useDeliversForm(
        closeModal, isEditing, clientData
    );


    const {
        debtsHook: {
            financialClientData: {
                totalDebtAmount
            }
        }
    } = useAppContext()


    return (
        <form className='delivers-form' onSubmit={onFinish}>
            <p>Total de la deuda: {totalDebtAmount.toLocaleString("es-AR",{style: "currency", currency: "ARS"})}</p>
            <div className="delivers-form-layout">
                <Input.Wrapper label="Monto de la entrega">
                    <Input
                        type='number'
                        placeholder={`Ingrese un monto entre 0 y ${totalDebtAmount.toLocaleString("es-AR")}`}
                        id='deliver_amount'
                        name='deliver_amount'
                        className='delivers-form-input'
                        value={formValues.deliver_amount}
                        onChange={handleInputChange}

                    />
                </Input.Wrapper>

                <Input.Wrapper label="Fecha de entrega">
                    <DateInput
                        placeholder='Ingrese la fecha de entrega (no mayor a 45 días)'
                        className='delivers-form-input'
                        id='deliver_date'
                        name='deliver_date'
                        onChange={handleDateChange}
                        value={formValues.deliver_date}
                        withAsterisk
                        valueFormat="DD/MM/YYYY"
                    />
                </Input.Wrapper>
            </div>
            <Button color='dark' style={{ maxWidth: "150px" }} type='submit'>
                Guardar entrega
            </Button>
        </form>
    );
}

export default DeliversForm;
