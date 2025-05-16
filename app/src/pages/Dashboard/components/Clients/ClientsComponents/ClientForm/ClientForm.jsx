import React from 'react'
import useClientForm from './utils/useClientForm'
import { IoMdPersonAdd } from "react-icons/io";
import { FaSave } from 'react-icons/fa';
import { Input, Loader } from '@mantine/core';
import "./ClientForm.css"

function ClientForm({ closeModal }) {
    const {
        clientFormRef,
        onFinish,
        errors,
        handleInputChange,
        formValues,
        savingClient
    } = useClientForm(closeModal)

    return (
        <form className='client-form' onSubmit={onFinish} ref={clientFormRef}>
            <Input.Wrapper
                label="Nombre completo"
                htmlFor="client_fullname"
                required

                error={errors.client_fullname}
            >
                <Input
                    name="client_fullname"
                    type="text"
                    value={formValues.client_fullname}
                    onChange={handleInputChange}
                />
            </Input.Wrapper>

            <Input.Wrapper
                label="DNI"
                error={errors.client_dni}
            >
                <Input
                    name="client_dni"
                    type="number"
                    value={formValues.client_dni}
                    onChange={handleInputChange}
                />
            </Input.Wrapper>

            <Input.Wrapper
                label="Correo"
                htmlFor="client_email"


                error={errors.client_email}
            >
                <Input
                    name="client_email"
                    type="email"
                    value={formValues.client_email}
                    onChange={handleInputChange}
                />
            </Input.Wrapper>

            <Input.Wrapper
                label="Teléfono"
                htmlFor="client_phone"
                error={errors.client_phone}
            >
                <Input
                    name="client_phone"
                    type="number"
                    value={formValues.client_phone}
                    onChange={handleInputChange}
                />
            </Input.Wrapper>



            <button

                type='submit'
                className='client-form-button'
                disabled={savingClient}

            >
                {!savingClient && (
                    <>Añadir cliente <IoMdPersonAdd /></>
                )}
                {savingClient && <Loader />}
            </button>
        </form>
    )
}

export default ClientForm
