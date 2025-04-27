import React from 'react'
import { ExpirationClient } from '../../../Context/Typescript/ExpirationTypes'
import dayjs from "dayjs"
interface Props {
    toOvercome: ExpirationClient["toOvercome"]
}
function ToOvercome({toOvercome}: Props) {
  return (
    <div className="expiration-table-manager">
        <table className='expiration-table'>
            <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Fecha de vencimiento</th>
                    <th>Vencimiento en</th>
                    <th>Saldo adeudado</th>
                    <th>Ultima entrega</th>
                </tr>
            </thead>
            <tbody>
                {toOvercome && toOvercome.map((exp, idx) => (
                    <tr key={idx}>
                        <td>{exp.client_fullname}</td>
                        <td>{dayjs(exp.exp_date).format("DD-MM-YYYY")}</td>
                        <td>{exp.days_remaining} día/s</td>
                        <td>N/A</td>
                        <td>{exp.last_deliver_date || "N/A"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default ToOvercome
