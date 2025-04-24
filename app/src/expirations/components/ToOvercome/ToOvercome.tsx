import React from 'react'

function ToOvercome() {
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
                <tr>
                    <td>Cliente 1</td>
                    <td>2023-03-15</td>
                    <td>7 días</td>
                    <td>$1000.00</td>
                    <td>2023-02-15</td>
                </tr>
                <tr>
                    <td>Cliente 2</td>
                    <td>2023-04-15</td>
                    <td>3 días</td>
                    <td>$2000.00</td>
                    <td>2023-03-15</td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default ToOvercome
