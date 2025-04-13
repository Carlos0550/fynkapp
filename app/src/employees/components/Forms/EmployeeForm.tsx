import React, { useState } from 'react'
import "./EmployeeForm.css"
import { Input, Select, Checkbox, Button } from '@mantine/core'
import { RoleLevel, RolesInterface, SectionsForRolesInterface } from '../../../Context/Typescript/EmployeesTypes'
import useEmployeeForm from './utils/useEmployeeForm'

function EmployeeForm() {
  const permissionLabels: Record<keyof SectionsForRolesInterface, string> = {
    fast_actions: "Acciones rápidas (Añadir nuevo cliente o un pago)",
    clients: "Sección de clientes",
    debts: "Sección de Deudas",
    expirations: "Sección de Vencimientos",
    admin_dashboard: "Panel de administración",
    managment: "Sección de Gestión",
  }

  const [sections] = useState<(keyof SectionsForRolesInterface)[]>([
    "fast_actions", "clients", "debts", "expirations", "admin_dashboard", "managment"
  ])

  const [roles] = useState<RolesInterface>({
    level1: {
      access_to: ["fast_actions"]
    },
    level2: {
      access_to: ["fast_actions", "clients", "debts"]
    },
    level3: {
      access_to: ["fast_actions", "clients", "debts", "expirations", "admin_dashboard"]
    }
  })

  const [selectedRole, setSelectedRole] = useState<RoleLevel>("level1")
  const [customAccessTo, setCustomAccessTo] = useState<(keyof SectionsForRolesInterface)[]>([])

  const {
    handleChangeValues,
    handleChangeRole,
    handleSubmit
  } = useEmployeeForm()

  const onRoleChangeHandler = (value: string | null) => {
    if (!value) return;
    const newRole = value as RoleLevel
    setSelectedRole(newRole)

    const access =
      newRole === "custom"
        ? customAccessTo
        : roles[newRole as Exclude<RoleLevel, 'custom'>].access_to

    handleChangeRole(newRole, access || [])
  }

  const onCustomAccessChangeHandler = (values: string[]) => {
    const updated = values as (keyof SectionsForRolesInterface)[]
    setCustomAccessTo(updated)
    handleChangeRole("custom", updated)
  }

  const assignedPermissions =
    selectedRole === "custom"
      ? customAccessTo
      : roles[selectedRole as Exclude<RoleLevel, 'custom'>].access_to

  return (
    <div className='employee-form-container'>
      <form className='employee-form' onSubmit={handleSubmit}>
        <Input.Wrapper required label='Nombre completo'>
          <Input placeholder='Jhon Doe' type='text' name='employee_name' onChange={handleChangeValues} />
        </Input.Wrapper>

        <Input.Wrapper required label='DNI del empleado'>
          <Input type='text' name='employee_dni' placeholder='12345698' onChange={handleChangeValues} />
        </Input.Wrapper>

        <Input.Wrapper required label='Correo electrónico'>
          <Input placeholder='jhondoe@gmail.com' type="email" name='employee_email' onChange={handleChangeValues} />
        </Input.Wrapper>

        <Select
          label="Rol del empleado"
          data={[
            { value: "level1", label: "Nivel 1 - Básico" },
            { value: "level2", label: "Nivel 2 - Intermedio" },
            { value: "level3", label: "Nivel 3 - Avanzado" },
            { value: "custom", label: "Personalizado" }
          ]}
          value={selectedRole}
          onChange={onRoleChangeHandler}
        />

        {selectedRole === "custom" && (
          <Checkbox.Group
            label="Seleccioná los permisos a otorgar"
            value={customAccessTo}
            onChange={onCustomAccessChangeHandler}
            mt="md"
          >
            {sections.map((section) => (
              <Checkbox
                key={section}
                m={5}
                value={section}
                label={permissionLabels[section]}
              />
            ))}
          </Checkbox.Group>
        )}

        <div className="permissions-preview" style={{ marginTop: "1rem" }}>
          <strong>Permisos asignados:</strong>
          <ul>
            {assignedPermissions && assignedPermissions.map((perm) => (
              <li key={perm}>{permissionLabels[perm]}</li>
            ))}
          </ul>
        </div>

        <Button type='submit' c={"white"} color='dark'>Guardar empleado</Button>
      </form>
    </div>
  )
}

export default EmployeeForm
