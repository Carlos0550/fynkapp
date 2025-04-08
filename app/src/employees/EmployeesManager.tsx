import React, { useState } from 'react'
import "./EmployeesManager.css"
import { Button } from '@mantine/core'
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs"

import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { EmployeesInterface } from '../Context/Typescript/EmployeesTypes';
function EmployeesManager() {
  const [empleados, setEmpleados] = useState<EmployeesInterface[]>([
    {
      employee_id: uuidv4(),
      name: "Carlos Méndez",
      role: "level2",
      hireDate: new Date("2022-03-15"),
      state: true
    },
    {
      employee_id: uuidv4(),
      name: "Lucía Ramírez",
      role: "level1",
      hireDate: new Date("2023-01-10"),
      state: true
    },
    {
      employee_id: uuidv4(),
      name: "Andrés Torres",
      role: "level3",
      hireDate: new Date("2021-06-22"),
      state: false
    },
    {
      employee_id: uuidv4(),
      name: "Mariana López",
      role: "level2",
      hireDate: new Date("2020-11-30"),
      state: true
    },
    {
      employee_id: uuidv4(),
      name: "Diego Fernández",
      role: "level1",
      hireDate: new Date("2024-05-05"),
      state: false
    }
  ]);
  
  const spanishLevels = (levelKey: string) => {
    if(!levelKey) return "N/A";
    const spanishLevels = {
      "level1": "Nivel 1",
      "level2": "Nivel 2",
      "level3": "Nivel 3",
      "customized": "Personalizada"
    }

    return spanishLevels[levelKey]
  }

  const employeesState = (state: boolean) => {
    if(typeof state === undefined) return "N/A";
    if(state) return "Activo"
    else return "Inactivo"
  }
  return (
    <div className='employees-manager-container'>
      <div className="employees-title">
        <h3>Gestión de empleados</h3>
        <Button c={"white"} color='dark'>Agregar empleado</Button>
      </div>
      <div className='employees-table-container'>
        <table className='employee-table'>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Permisos</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {empleados && empleados.length > 0 && empleados.map((person) => (
              <tr key={person.employee_id}>
              <td>{person.name}</td>
              <td>{spanishLevels(person.role)}</td>
              <td>{dayjs(person.hireDate).format("DD-MM-YYYY")}</td>
              <td>
                <div className={person.state ? 'employee-table-tags active' : 'employee-table-tags inactive'}>
                  {employeesState(person.state)}
                </div>
              </td>
              <td >
                <div className='employee-table-actions'>
                <Button variant="outline" color="indigo"><FaEdit/></Button>
                <Button variant="outline" color='red'><FaDeleteLeft/></Button>
                </div>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeesManager
