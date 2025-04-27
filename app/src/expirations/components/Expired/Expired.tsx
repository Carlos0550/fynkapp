import React from 'react'
import { ExpirationClient } from '../../../Context/Typescript/ExpirationTypes'
import dayjs from "dayjs"
interface Props {
    expiredData: ExpirationClient["expired"]
}
function Expired({ expiredData }: Props) {
    return (
        <div className="expiration-table-manager">
            <table className='expiration-table'>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Fecha de vencimiento</th>
                        <th>Saldo adeudado</th>
                        <th>Ultima entrega</th>
                        <th>Vencido hace</th>
                    </tr>
                </thead>
                <tbody>
                    {expiredData && expiredData.map((exp, idx) => (
                        <tr key={idx}>
                            <td>{exp.client_fullname}</td>
                            <td>{dayjs(exp.exp_date).format("DD-MM-YYYY")}</td>
                            <td>N/A</td>
                            <td>{exp.last_deliver_date || "N/A"}</td>
                            <td>{exp.days_remaining} día/s</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Expired
