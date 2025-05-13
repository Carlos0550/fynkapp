import React from 'react'
import useBusinessForm from './useBusinessForm'
import { Button, Input } from '@mantine/core'

function BusinessForm() {
    const {
        inputRef,
        onFinish
    } = useBusinessForm()
  return (
    <form onSubmit={onFinish}>
        <Input.Wrapper
            style={{textAlign: "left"}}
            label="Nombre de la sucursal"
            required
            mb={5}
            description="Ingrese el nombre de la empresa/sucursal/emprendimiento"
        >
            <Input
                name="business_name"
                type="text"
                
                ref={inputRef}
            />
        </Input.Wrapper>
        <Button type='submit' color='dark'>Guardar</Button>
    </form>
  )
}

export default BusinessForm
