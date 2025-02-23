import React from 'react'
import useClientForm from './utils/useClientForm'
import { useMediaQuery } from '@mantine/hooks'
import { Modal } from '@mantine/core';

import { RxCross1 } from "react-icons/rx";
import { IoMdPersonAdd } from "react-icons/io";

import "./ClientForm.css"

function ClientForm({ closeModal }) {
    const {
        clientFormRef,
        onFinish,
        errors
    } = useClientForm(closeModal)

    const isMobile = useMediaQuery('(max-width: 50em)');

    return (
        <Modal
            opened={true}
            onClose={() => closeModal()}
            title="Formulario de clientes"
            size="xl"
            centered
            fullScreen={isMobile}
            padding="sm"
            overlayProps={{
                backgroundOpacity: 0.6,
                blur: 5,
            }}
            closeButtonProps={{
                icon: <RxCross1 />,
            }}
        >
            <form className='client-form' onSubmit={onFinish} ref={clientFormRef}>
                <div className="client-form-labels-group">
                    <label htmlFor="client_fullname">Nombre completo:
                        <input type="text" id="client_fullname" name="client_fullname" />
                        {errors.client_fullname && <span
                            style={{
                                color: "red",
                            }}
                        >{errors.client_fullname}</span>}
                    </label>

                    <label htmlFor="client_dni">DNI:
                        <input type="number" id="client_dni" name="client_dni" />
                        {errors.client_dni && <span
                            style={{
                                color: "red",
                            }}
                        >{errors.client_dni}</span>}
                    </label>
                </div>

                <div className="client-form-labels-group">
                    <label htmlFor="client_email">Correo:
                        <input type="email" id="client_email" name="client_email" />
                        {errors.client_email && <span
                            style={{
                                color: "red",
                            }}
                        >{errors.client_email}</span>} 
                    </label>

                    <label htmlFor="client_phone">Telefono:
                        <input type="number" id="client_phone" name="client_phone" />
                        {errors.client_phone && <span
                            style={{
                                color: "red",
                            }}
                        >{errors.client_phone}</span>}
                    </label>
                </div>

                <div className="client-form-labels-group">
                    <label htmlFor="client_address">Direccion:
                        <input type="text" id="client_address" name="client_address" />
                        {errors.client_address && <span
                            style={{
                                color: "red",
                            }}
                        >{errors.client_address}</span>}
                    </label>

                    <label htmlFor="client_city">Ciudad:
                        <input type="text" id="client_city" name="client_city" />
                        {errors.client_city && <span style={{
                            color: "red",
                        }}>{errors.client_city}</span>}
                    </label>
                </div>
                <button type='submit' className='client-form-button'>
                    Añadir cliente <IoMdPersonAdd />
                </button>
            </form>
        </Modal>
    )
}

export default ClientForm
